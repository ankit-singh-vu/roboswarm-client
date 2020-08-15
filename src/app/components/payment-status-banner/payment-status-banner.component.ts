import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, User } from 'app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-status-banner',
  templateUrl: './payment-status-banner.component.html',
  styleUrls: ['./payment-status-banner.component.css']
})
export class PaymentStatusBannerComponent implements OnInit, OnDestroy {
  showBanner = false;
  private userChangeSubscription: Subscription;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    const force = true;
    const u: User = await this.userService.getCurrentUser(force);
    this.showBanner = u.is_delinquent;
    this.userChangeSubscription = this.userService.userChanged.subscribe(this.handleUserChange);
  }

  handleUserChange = async () => {
    const force = true;
    const u: User = await this.userService.getCurrentUser(force);
    this.showBanner = u.is_delinquent;
  }

  async ngOnDestroy() {
    if (this.userChangeSubscription) {
      this.userChangeSubscription.unsubscribe();
      this.userChangeSubscription = null;
    }
  }

}
