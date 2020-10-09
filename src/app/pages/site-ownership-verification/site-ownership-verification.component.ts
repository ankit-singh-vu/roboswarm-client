import { Component, OnInit } from '@angular/core';
import { SiteOwnershipService, SiteOwnership } from '../../services/site-ownership.service';
import { VerifyComplete } from '../../components/verify-site-ownership-button/verify-site-ownership-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-site-ownership-verification',
  templateUrl: './site-ownership-verification.component.html',
  styleUrls: ['./site-ownership-verification.component.css']
})
export class SiteOwnershipVerificationComponent implements OnInit {
  loading: boolean;
  sites: SiteOwnership[] = [];

  constructor(private siteOwnershipService: SiteOwnershipService,
              private metricsService: MetricsService,
              private modalService: NgbModal) { }

  async ngOnInit() {
    this.loading = true;
    this.sites = await this.siteOwnershipService.getAll();
    this.metricsService.track('SITE_OWNERSHIP_VERIFICATION_VIEW');
    this.loading = false;
  }

  async deleteSite(content: any, id: number) {
    try {
      const result = await this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result;
      if (result === 'continue') {
        await this.siteOwnershipService.delete(id);
        const index: number = this.sites.findIndex(site => site.id === id);
        this.sites.splice(index, 1);
        this.metricsService.track('SITE_OWNERSHIP_VERIFICATION_DELETE');
      }
    } catch (err) { /* no-op */ }
  }

  onVerifyCompleted(evt: VerifyComplete) {
    const index: number = this.sites.findIndex(site => site.id === evt.id);
    this.sites[index].verified = evt.verified;
  }
}
