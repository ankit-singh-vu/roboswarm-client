import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private http: HttpService;
  private token: TokenService;
  private router: Router;

  model: LoginForm = {
    email: '',
    password: ''
  };
  submitted = false;
  error = '';

  constructor(_http: HttpService,
    _token: TokenService,
    _router: Router) {
    this.http = _http;
    this.token = _token;
    this.router = _router;
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
          this.error = 'Invalid email or password. Please try again.';
        } else {
          this.token.saveToken(response.data);
          this.router.navigate(['/dashboard']);
        }
      } catch (err) {
        this.error = 'Invalid email or password. Please try again.';
      }
    } else {
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

