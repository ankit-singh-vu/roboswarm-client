import { Component, OnInit } from '@angular/core';
import { HttpService, HttpRequestOptions } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { MetricsService } from '../../services/metrics.service';
import { UserService } from 'app/services/user.service';

interface RegisterForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private http: HttpService;
  private token: TokenService;

  model: RegisterForm = {
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  };
  submitted = false;
  error = '';

  constructor(_http: HttpService,
              private router: Router,
              private metrics: MetricsService,
              private userService: UserService,
              _token: TokenService) {
    this.http = _http;
    this.token = _token;
  }

  ngOnInit() {
    this.metrics.track('REGISTER_VIEW');
  }

  async onSubmit(form) {
    this.error = '';
    if (form.valid) {
      this.submitted = true;
      try {
        const response = await this.http.request({
          authenticated: false,
          data: this.model,
          requestType: 'POST',
          url: '/api/v1/public/user'
        });
        if (response.statusCode !== 201) {
          console.log({ response });
          this.error = response.data;
        } else {
          this.token.saveToken(response.data.token);
          const user = await this.userService.getCurrentUser();
          this.metrics.identifyUser(user.email);
          this.metrics.track('REGISTER_SUCCESS');
          this.router.navigate(['/dashboard']);
        }
      } catch (err) {
        this.metrics.track('REGISTER_FAILURE');
        this.error = 'There was an error creating your user. Please try again.';
      }
    } else {
      this.metrics.track('REGISTER_INVALID');
      this.error = 'Invalid form data. Please make sure all fields are completed.';
    }
    this.submitted = false;
  }

  allFieldsCompleted() {
    if (this.model.email === undefined || this.model.email === '') {
      return false;
    }
    if (this.model.password === undefined || this.model.password === '') {
      return false;
    }
    if (this.model.first_name === undefined || this.model.first_name === '') {
      return false;
    }
    if (this.model.last_name === undefined || this.model.last_name === '') {
      return false;
    }
    return true;
  }

}
