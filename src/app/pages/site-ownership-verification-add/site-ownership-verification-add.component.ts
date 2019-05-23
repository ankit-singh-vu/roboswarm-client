import { Component } from '@angular/core';
import { SiteOwnership, SiteOwnershipService } from '../../services/site-ownership.service';

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

  constructor(private siteOwnershipService: SiteOwnershipService) { }

  async onSubmit() {
    this.submitted = true;
    this.newSite = await this.siteOwnershipService.create({ base_url: this.model.url });
    this.submitted = false;
  }

  canSave(): boolean {
    return this.model.url && this.model.url.trim() !== '';
  }
}
