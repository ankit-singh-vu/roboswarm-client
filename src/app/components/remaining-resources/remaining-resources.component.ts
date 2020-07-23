import { Component, OnInit } from '@angular/core';
import { UserService, ResourceAvailability } from 'app/services/user.service';

@Component({
  selector: 'app-remaining-resources',
  templateUrl: './remaining-resources.component.html',
  styleUrls: ['./remaining-resources.component.css']
})
export class RemainingResourcesComponent implements OnInit {
  resources: ResourceAvailability;
  loadTestPercentageUsed = 0;
  showValue = false;
  working = true;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.resources = await this.userService.getResources();
    const loadTestPercentage = this.resources.loadTests / this.resources.maxLoadTests;
    this.loadTestPercentageUsed = Math.ceil(loadTestPercentage * 100);
    this.showValue = this.loadTestPercentageUsed > 25;
    this.working = false;
  }

}
