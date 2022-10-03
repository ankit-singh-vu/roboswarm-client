import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MetricsService } from '../../services/metrics.service';

interface ChangePasswordForm {
  passwordA: string;
  passwordB: string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  nonce: string;
  model: ChangePasswordForm = {
    passwordA: null,
    passwordB: null
  };
  submitted = false;
  passwordChanged = false;
  error = '';

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private metrics: MetricsService) { }

  ngOnInit(): void {
    this.nonce = this.route.snapshot.params.id;
    this.metrics.track('CHANGE_PASSWORD_VIEW');
  }

  allFieldsCompleted(): boolean {
    return (
      (this.model.passwordA && this.model.passwordA.trim() !== '') &&
      (this.model.passwordA && this.model.passwordB.trim() !== '')
    );
  }

  fieldsValid(): boolean {
    return (
      (this.model.passwordA && this.model.passwordA.trim() !== '') &&
      (this.model.passwordA && this.model.passwordB.trim() !== '') &&
      (this.model.passwordA === this.model.passwordB)
    );
  }

  async onSubmit(form: NgForm) {
    this.error = '';
    if (form.valid && this.fieldsValid()) {
      this.submitted = true;
      await this.userService.changePassword(this.nonce, this.model.passwordA);
      this.metrics.track('CHANGE_PASSWORD_SUBMIT');
      this.submitted = false;
      this.passwordChanged = true;
    } else {
      this.error = 'Error: Your passwords do not match.';
    }
  }

}
