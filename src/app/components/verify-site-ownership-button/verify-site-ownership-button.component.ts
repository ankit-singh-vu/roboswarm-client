import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SiteOwnershipService } from '../../services/site-ownership.service';

export interface VerifyComplete {
  id: number;
  verified: boolean;
}

@Component({
  selector: 'app-verify-site-ownership-button',
  templateUrl: './verify-site-ownership-button.component.html',
  styleUrls: ['./verify-site-ownership-button.component.css']
})
export class VerifySiteOwnershipButtonComponent {

  @Input() siteOwnershipId: number;
  @Output() verifyCompleted = new EventEmitter<VerifyComplete>();

  working = false;

  constructor(private siteOwnershipService: SiteOwnershipService) { }

  async verify() {
    this.working = true;
    const result = await this.siteOwnershipService.verify(this.siteOwnershipId);
    this.verifyCompleted.emit({
      id: this.siteOwnershipId,
      verified: result.verified
    });
    this.working = false;
  }
}
