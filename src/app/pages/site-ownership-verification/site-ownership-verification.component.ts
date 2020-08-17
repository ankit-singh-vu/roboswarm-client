import { Component, OnInit } from '@angular/core';
import { SiteOwnershipService, SiteOwnership } from '../../services/site-ownership.service';
import { VerifyComplete } from '../../components/verify-site-ownership-button/verify-site-ownership-button.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MetricsService } from 'app/services/metrics.service';
import { User, UserService } from 'app/services/user.service';

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
              private sanitizer: DomSanitizer,
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

  async openDocumentation(content: any) {
    try {
      this.metricsService.track('SITE_OWNERSHIP_OPEN_DOCUMENTATION');
      await this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg'
      });
    } catch (err) { /* no-op */ }
  }

  onVerifyCompleted(evt: VerifyComplete) {
    const index: number = this.sites.findIndex(site => site.id === evt.id);
    this.sites[index].verified = evt.verified;
  }

  getMetaTag(uuid: string): SafeHtml {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };

    function safeRepl(str): string {
      return String(str).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
      });
    }

    return this.sanitizer.bypassSecurityTrustHtml(safeRepl(`<meta name="kernl-verify" content="${uuid}">`));
  }

}
