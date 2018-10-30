import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  user: User;
  loading: boolean;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.loading = true;
    this.user = await this.userService.getCurrentUser();
    this.loading = false;
  }

  async selectPlan(planName: string) {
    this.loading = true;
    await this.userService.selectPlan(planName);
    this.user = await this.userService.getCurrentUser();
    this.loading = false;

  }

}
