import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MetricsService } from '../../services/metrics.service';

interface PasswordResetForm {
  email: string;
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  model: PasswordResetForm = {
    email: null
  };
  submitted = false;
  error = '';
  resetRequested = false;

  constructor(private userService: UserService,
              private metricService: MetricsService) {}

  ngOnInit() {
    this.metricService.track('PASSWORD_RESET_VIEW');
  }

  allFieldsCompleted(): boolean {
    return this.model.email && this.model.email.trim() !== '';
  }

  async onSubmit(form: NgForm) {
    this.error = '';
    if (form.valid) {
      this.submitted = true;
      await this.userService.resetPassword(this.model.email);
      this.metricService.track('PASSWORD_RESET_SUBMIT');
      this.resetRequested = true;
      this.submitted = false;
    } else {
      this.error = 'Email is a required field.';
    }
  }
}
