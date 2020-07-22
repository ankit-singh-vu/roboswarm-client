import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/services/user.service';

interface PasswordResetForm {
  email: string;
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  model: PasswordResetForm = {
    email: null
  };
  submitted = false;
  error = '';
  resetRequested = false;

  constructor(private userService: UserService) {}

  allFieldsCompleted(): boolean {
    return this.model.email && this.model.email.trim() !== '';
  }

  async onSubmit(form: NgForm) {
    this.error = '';
    if (form.valid) {
      this.submitted = true;
      await this.userService.resetPassword(this.model.email);
      this.resetRequested = true;
      this.submitted = false;
    } else {
      this.error = 'Email is a required field.';
    }
  }
}
