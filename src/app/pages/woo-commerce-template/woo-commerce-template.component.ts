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

  async deleteTemplate(id: number) {
    await this.templateService.deleteWooTemplate(id);
    this.templates = await this.templateService.getAllWooCommerce();
  }

  hasOverrideData(template: WooCommerceTemplate): boolean {
    return template.data_override?.trim() !== '';
  }

}
