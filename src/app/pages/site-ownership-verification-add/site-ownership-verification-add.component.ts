import { Component } from '@angular/core';
import { SiteOwnership, SiteOwnershipService } from '../../services/site-ownership.service';
import { Router } from '@angular/router';

interface SiteOwnershipUrl {
  url: string;
}

@Component({
  selector: 'app-site-ownership-verification-add',
  templateUrl: './site-ownership-verification-add.component.html',
  styleUrls: ['./site-ownership-verification-add.component.css']
})
export class SiteOwnershipVerificationAddComponent {

  model: SiteOwnershipUrl = {
    url: ''
  };
  error = '';
  newSite: SiteOwnership;
  submitted = false;

  constructor(private siteOwnershipService: SiteOwnershipService,
              private router: Router) { }

  async onSubmit() {
    this.submitted = true;
    try {
      this.newSite = await this.siteOwnershipService.create({ base_url: this.model.url });
      this.router.navigate(['/dashboard/site-ownership-verification']);
    } catch (err) {
      this.error = 'There was an error verifying your site. Try again.';
    }
    this.submitted = false;
  }

  canSave(): boolean {
    return this.model.url && this.model.url.trim() !== '';
  }
}
