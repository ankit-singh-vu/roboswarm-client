import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { RequestResult } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { MetricsService } from '../../services/metrics.service';

declare const StripeCheckout: any;

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  user: User;
  loading: boolean;
  error: string;
  planToSelect: string;
  disableButtons = false;

  constructor(private userService: UserService,
              private metrics: MetricsService) { }

  async ngOnInit() {
    this.loading = true;
    this.user = await this.userService.getCurrentUser();
    this.metrics.track('BILLING_VIEW', { user: this.user });
    this.loading = false;
  }

  async selectPlan(planName: string) {
    this.error = undefined;
    this.disableButtons = true;
    this.planToSelect = planName;
    this.error = undefined;
    const result: RequestResult = await this.userService.selectPlan(planName);
    if (result.statusCode) {
      if (result.statusCode === 500 || result.statusCode === 400) {
        this.error = result.data;
      }
    } else {
      this.user = await this.userService.getCurrentUser();
    }
    this.disableButtons = false;
    this.metrics.track('BILLING_SELECT_PLAN', { user: this.user , plan: planName });
  }

  async addOrUpdateCard() {
    this.disableButtons = true;
    const handler = StripeCheckout.configure({
      key: environment.stripeApiPublic,
      image: 'https://kernl.us/static/img/kernl_cloud.png',
      locale: 'auto',
      name: 'RoboSwarm by Kernl',
      description: 'Add or Update Credit Card',
      panelLabel: 'Save Credit Card',
      label: 'Save Credit Card',
      allowRememberMe: false,
      email: this.user.email,
      zipCode: true,
      billingAddress: true,
      token: async (token) => {
        await this.userService.updateCard(token.id, token.card.id);
        this.user = await this.userService.getCurrentUser();
        this.disableButtons = false;
        this.error = undefined;
        this.metrics.track('BILLING_ADD_CARD', { user: this.user });
      },
      closed: async () => {
        this.disableButtons = false;
      }
    });
    handler.open();
  }

  async deleteCard() {
    this.disableButtons = true;
    await this.userService.deleteCard();
    this.disableButtons = false;
    this.loading = true;
    this.user = await this.userService.getCurrentUser();
    this.loading = false;
  }

}
