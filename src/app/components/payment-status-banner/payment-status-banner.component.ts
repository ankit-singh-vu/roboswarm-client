import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'app/services/user.service';

@Component({
  selector: 'app-payment-status-banner',
  templateUrl: './payment-status-banner.component.html',
  styleUrls: ['./payment-status-banner.component.css']
})
export class PaymentStatusBannerComponent implements OnInit {
  showBanner = false;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    const u: User = await this.userService.getCurrentUser();
    this.showBanner = u.is_delinquent;
  }

}
