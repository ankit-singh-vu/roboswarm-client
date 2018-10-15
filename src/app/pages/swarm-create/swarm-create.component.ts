import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';

interface CreateSwarmForm {
  name: string;
  simulated_users: number;
  swarm_size: number;
  duration_hours: number;
  duration_minutes: number;
  swarm_region: string;
  load_test_file: File;
  host_url: string;
  spawn_rate: number;
  swarm_ui_type: string;
}

@Component({
  selector: 'app-swarm-create',
  templateUrl: './swarm-create.component.html',
  styleUrls: ['./swarm-create.component.css']
})
export class SwarmCreateComponent {

  private rawHttp: Http;
  private http: HttpService;
  private router: Router;
  private token: TokenService;

  model: CreateSwarmForm = {
    name: '',
    simulated_users: 50,
    swarm_size: 1,
    duration_hours: 1,
    duration_minutes: 30,
    swarm_region: 'nyc3',
    load_test_file: null,
    spawn_rate: 1,
    host_url: null,
    swarm_ui_type: 'locust'
  };
  submitted = false;
  error = '';
  test_type = 'locust';

  constructor(_http: HttpService, _router: Router, _token: TokenService, _rawHttp: Http) {
    this.rawHttp = _rawHttp;
    this.http = _http;
    this.router = _router;
    this.token = _token;
  }

  async onSubmit(form) {
    this.error = '';
    if (form.valid) {
      this.submitted = true;
      this.error = '';

      // Upload the file first.
      const filePath = await this.uploadFile();
      try {
        const machines = [];
        for (let i = 0; i < this.model.swarm_size; i++) {
          machines.push({ region: this.model.swarm_region });
        }
        const data = {
          name: this.model.name,
          simulated_users: this.model.simulated_users,
          machines,
          file_path: filePath,
          spawn_rate: this.model.spawn_rate,
          host_url: this.model.host_url,
          region: this.model.swarm_region,
          duration: (this.model.duration_hours * 60) + this.model.duration_minutes,
          swarm_ui_type: this.test_type
        };
        const response = await this.http.request({
          authenticated: true,
          data,
          requestType: 'POST',
          url: '/api/v1/swarm'
        });
        if (response.statusCode !== 201) {
          this.error = 'There was an error creating your load test. Please try again.';
        } else {
          this.router.navigate(['/dashboard']);
        }
      } catch (err) {
        this.error = 'There was an error creating your load test. Please try again.';
      }
    } else {
      this.error = 'Invalid form data. Please make sure all fields are completed.';
    }
    this.submitted = false;
  }

  allFieldsCompleted() {
    if (this.model.simulated_users === undefined || this.model.simulated_users <= 0) {
      return false;
    }
    if (this.model.swarm_size === undefined || this.model.swarm_size <= 0) {
      return false;
    }
    if (this.model.duration_hours === undefined || this.model.duration_hours < 0) {
      return false;
    }
    if (this.model.duration_minutes === undefined || this.model.duration_minutes < 0) {
      return false;
    }
    if (this.model.duration_minutes === undefined || this.model.name === '') {
      return false;
    }
    if (this.model.load_test_file === undefined || !this.model.load_test_file) {
      return false;
    }
    return true;
  }

  async uploadFile() {
    // Collect the file.
    const fileElement: HTMLInputElement = document.getElementById('load_test_file') as HTMLInputElement;
    const file: File = fileElement.files[0];
    const formData: FormData = new FormData();
    formData.append('loadTestData', file, file.name);

    // Set the headers.
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${this.token.jwt}`);
    const options = new RequestOptions({ headers: headers });

    // Make the request.
    try {
      const result: any = await this.rawHttp.post(`${environment.serverUrl}/api/v1/swarm/file-upload`, formData, options).toPromise();
      return JSON.parse(result._body).filePath;
    } catch (err) {
      console.log(err);
    }
  }

}
