import { Component } from '@angular/core';
import {
  HttpService,
  HttpRequestOptions
} from '../../services/http.service';

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
export class RegisterComponent {
  private http: HttpService;
  model: RegisterForm = {
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  };
  submitted = false;
  error = '';

  constructor(_http: HttpService) {
    this.http = _http;
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
          this.error = response.data;
        } else {
          //
          // Implement me!!
          // Go authenticate, set token, login, go to dashboard.
          //
        }
      } catch (err) {
        this.error = 'There was an error creating your user. Please try again.';
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
    if (this.model.first_name === undefined || this.model.first_name === '') {
      return false;
    }
    if (this.model.last_name === undefined || this.model.last_name === '') {
      return false;
    }
    return true;
  }

}
