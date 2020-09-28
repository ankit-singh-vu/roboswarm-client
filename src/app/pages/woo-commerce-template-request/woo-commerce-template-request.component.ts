import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-woo-commerce-template-request',
  templateUrl: './woo-commerce-template-request.component.html',
  styleUrls: ['./woo-commerce-template-request.component.css']
})
export class WooCommerceTemplateRequestComponent implements OnInit {
  loading = true;

  constructor(private templateService: TemplateService) { }

  async ngOnInit() {
    await this.templateService.requestWooCommerceTemplate();
    this.loading = false;
  }

}
