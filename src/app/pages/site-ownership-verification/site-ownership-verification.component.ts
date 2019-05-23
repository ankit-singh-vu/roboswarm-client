import { Component, OnInit } from '@angular/core';
import { SiteOwnershipService, SiteOwnership } from '../../services/site-ownership.service';

@Component({
  selector: 'app-site-ownership-verification',
  templateUrl: './site-ownership-verification.component.html',
  styleUrls: ['./site-ownership-verification.component.css']
})
export class SiteOwnershipVerificationComponent implements OnInit {
  loading: boolean;
  sites: SiteOwnership[] = [];

  constructor(private siteOwnershipService: SiteOwnershipService) { }

  async ngOnInit() {
    this.loading = true;
    this.sites = await this.siteOwnershipService.getAll();
    this.loading = false;
  }

}
