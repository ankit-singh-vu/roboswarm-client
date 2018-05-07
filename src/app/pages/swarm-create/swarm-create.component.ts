import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

interface CreateSwarmForm {
  name: string;
  simulated_users: number;
  swarm_size: number;
  duration_hours: number;
  duration_minutes: number;
  swarm_region: string;
}

@Component({
  selector: 'app-swarm-create',
  templateUrl: './swarm-create.component.html',
  styleUrls: ['./swarm-create.component.css']
})
export class SwarmCreateComponent {

  private http: HttpService;
  private router: Router;

  model: CreateSwarmForm = {
    name: '',
    simulated_users: 50,
    swarm_size: 1,
    duration_hours: 1,
    duration_minutes: 30,
    swarm_region: 'nyc3'
  };
  submitted = false;
  error = '';

  constructor(_http: HttpService, _router: Router) {
    this.http = _http;
    this.router = _router;
  }

  async onSubmit(form) {
    this.error = '';
    if (form.valid) {
      this.submitted = true;
      this.error = '';
      try {
        const machines = [];
        for (let i = 0; i < this.model.swarm_size; i++) {
          machines.push({ region: this.model.swarm_region });
        }
        const data = {
          name: this.model.name,
          simulated_users: this.model.simulated_users,
          machines
          // TODO duration: number; // in minutes
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
    return true;
  }

}
