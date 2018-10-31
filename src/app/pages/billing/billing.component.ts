import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { RequestResult } from '../../services/http.service';
import { environment } from '../../../environments/environment';

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

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.loading = true;
    this.user = await this.userService.getCurrentUser();
    this.loading = false;
  }

  async selectPlan(planName: string) {
    this.disableButtons = true;
    this.planToSelect = planName;
    this.error = undefined;
    const result: RequestResult = await this.userService.selectPlan(planName);
    if (result.statusCode === 500) {
      this.error = result.data;
    } else {
      this.user = await this.userService.getCurrentUser();
    }
    this.disableButtons = false;
  }

  async addOrUpdateCard() {
    // Todo: Disable button.
    // Todo: fetch user again. If they have card, add a notification in the card UX.
    const handler = StripeCheckout.configure({
      key: environment.stripeApiPublic,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      name: 'RoboSwarm',
      description: 'Add or Update Credit Card',
      panelLabel: 'Save Credit Card',
      label: 'Save Credit Card',
      allowRememberMe: false,
      email: this.user.email,
      zipCode: true,
      billingAddress: true,
      token: async (token) => {
        await this.userService.updateCard(token.id, token.card.id);
      }
    });
    handler.open();
  }

}
