import { Component, OnInit } from '@angular/core';
import { SiteOwnershipService, SiteOwnership } from '../../services/site-ownership.service';
import { VerifyComplete } from '../../components/verify-site-ownership-button/verify-site-ownership-button.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-site-ownership-verification',
  templateUrl: './site-ownership-verification.component.html',
  styleUrls: ['./site-ownership-verification.component.css']
})
export class SiteOwnershipVerificationComponent implements OnInit {
  loading: boolean;
  sites: SiteOwnership[] = [];

  constructor(private siteOwnershipService: SiteOwnershipService,
              private sanitizer: DomSanitizer,
              private modalService: NgbModal) { }

  async ngOnInit() {
    this.loading = true;
    this.sites = await this.siteOwnershipService.getAll();
    this.loading = false;
  }

  async deleteSite(content: any, id: number) {
    try {
      const result = await this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result;
      if (result === 'continue') {
        await this.siteOwnershipService.delete(id);
        const index: number = this.sites.findIndex(site => site.id === id);
        this.sites.splice(index, 1);
      }
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

    return this.sanitizer.bypassSecurityTrustHtml(safeRepl(`<meta name="load-test-verify" content="${uuid}">`));
  }

}
