import { Component, OnInit } from '@angular/core';
import { SiteOwnership, SiteOwnershipService } from '../../services/site-ownership.service';
import { Router } from '@angular/router';
import { MetricsService } from '../../services/metrics.service';

interface SiteOwnershipUrl {
  url: string;
}

@Component({
  selector: 'app-site-ownership-verification-add',
  templateUrl: './site-ownership-verification-add.component.html',
  styleUrls: ['./site-ownership-verification-add.component.css']
})
export class SiteOwnershipVerificationAddComponent implements OnInit {

  model: SiteOwnershipUrl = {
    url: ''
  };
  error = '';
  newSite: SiteOwnership;
  submitted = false;

  constructor(private siteOwnershipService: SiteOwnershipService,
              private metricsService: MetricsService,
              private router: Router) { }

  async ngOnInit() {
    this.metricsService.track('SITE_OWNERSHIP_VERIFICATION_ADD_VIEW');
  }
  async onSubmit() {
    this.submitted = true;
    try {
      this.newSite = await this.siteOwnershipService.create({ base_url: this.model.url });
      this.metricsService.track('SITE_OWNERSHIP_VERIFICATION_ADD_SUCCESS');
      this.router.navigate(['/dashboard/site-ownership-verification']);
    } catch (err) {
      this.metricsService.track('SITE_OWNERSHIP_VERIFICATION_ADD_FAILURE');
      this.error = 'There was an error verifying your site. Try again.';
    }
    this.submitted = false;
  }

  canSave(): boolean {
    return this.model.url && this.model.url.trim() !== '';
  }
}
