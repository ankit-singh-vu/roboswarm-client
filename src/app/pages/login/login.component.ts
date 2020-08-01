import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { MetricsService } from '../../services/metrics.service';
import { UserService } from 'app/services/user.service';

interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: LoginForm = {
    email: '',
    password: ''
  };
  submitted = false;
  error = '';

  constructor(private http: HttpService,
              private token: TokenService,
              private userService: UserService,
              private router: Router,
              private metrics: MetricsService) {
  }

  ngOnInit() {
    this.metrics.track('LOGIN_VIEW');
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
          url: '/api/v1/public/user/auth'
        });
        if (response.statusCode !== 200) {
          this.metrics.track('LOGIN_FAILURE');
          this.error = 'Invalid email or password. Please try again.';
        } else {
          this.token.saveToken(response.data);
          const user = await this.userService.getCurrentUser();
          this.metrics.identifyUser(user.email);
          this.metrics.track('LOGIN_SUCCESS');
          this.router.navigate(['/dashboard']);
        }
      } catch (err) {
        this.metrics.track('LOGIN_FAILURE');
        this.error = 'Invalid email or password. Please try again.';
      }
    } else {
      this.metrics.track('LOGIN_INVALID');
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
    return true;
  }
}

