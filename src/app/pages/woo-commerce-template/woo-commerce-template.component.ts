import { Component, OnInit } from '@angular/core';
import { TemplateService, WooCommerceTemplate } from '../../services/template.service';

@Component({
  selector: 'app-woo-commerce-template',
  templateUrl: './woo-commerce-template.component.html',
  styleUrls: ['./woo-commerce-template.component.css']
})
export class WooCommerceTemplateComponent implements OnInit {
  loading = true;
  templates: WooCommerceTemplate[] = [];

  constructor(private templateService: TemplateService) { }

  async ngOnInit() {
    this.templates = await this.templateService.getAllWooCommerce();
    this.loading = false;
  }

}
