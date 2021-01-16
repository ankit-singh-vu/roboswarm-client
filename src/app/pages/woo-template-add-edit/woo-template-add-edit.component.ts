import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TemplateService, AddUpdateWooCommerceTemplate, WooCommerceTemplate } from '../../services/template.service';

@Component({
  selector: 'app-woo-template-add-edit',
  templateUrl: './woo-template-add-edit.component.html',
  styleUrls: ['./woo-template-add-edit.component.css']
})
export class WooTemplateAddEditComponent implements OnInit {
  id: number = null;
  model: AddUpdateWooCommerceTemplate = {
    name: null,
    description: '',
    cart_url: null,
    checkout_url: null,
    shop_url: null,
    product_a_url: null,
    product_b_url: null
  };
  submitted = false;
  error = '';
  working = true;

  constructor(private templateService: TemplateService,
              private router: Router,
              private route: ActivatedRoute) { }

  async ngOnInit() {
    this.working = true;
    const tmpId = this.route.snapshot.params?.id;
    this.id = tmpId ? parseInt(tmpId, 10) : null;
    if (this.id) {
      const template = await this.templateService.getWooTemplate(this.id);
      this.model = template;
    } else {
      // Add metrics
    }
    this.working = false;
  }

  async onSubmit(createTemplateForm: NgForm) {
    this.error = '';
    if (createTemplateForm.valid && createTemplateForm.submitted) {
      this.submitted = true;
      if (this.id) {
        await this.templateService.updateWooTemplate(this.id, this.model);
      } else {
        await this.templateService.createWooTemplate(this.model);
      }
      this.router.navigate(['/dashboard/woocommerce-template']);
    } else {
      this.error = 'There was an error with your form.';
    }
  }

  allFieldsCompleted() {
    return (
      (this.model.cart_url && this.model.cart_url.trim() !== '') &&
      (this.model.name && this.model.name.trim() !== '') &&
      (this.model.checkout_url && this.model.checkout_url.trim() !== '') &&
      (this.model.shop_url && this.model.shop_url.trim() !== '') &&
      (this.model.product_a_url && this.model.product_a_url.trim() !== '') &&
      (this.model.product_b_url && this.model.product_b_url.trim() !== '')
    );
  }

  hasError() {
    return this.error && this.error.trim() !== '';
  }

  isValid() {
    const hasHttp = this.model.cart_url.includes('http') ||
      this.model.checkout_url.includes('http') ||
      this.model.shop_url.includes('http') ||
      this.model.product_a_url.includes('http') ||
      this.model.product_b_url.includes('http');
    if (hasHttp) {
      this.error = 'Invalid path. Paths should not contain http:// or https://';
      return false;
    } else {
      this.error = '';
      return true;
    }
  }

}
