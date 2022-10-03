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
    data_override: JSON.stringify({
      "billing_first_name": "James",
      "billing_last_name": "Doe",
      "billing_company": "Roboswarm.dev",
      "billing_country": "US",
      "billing_address_1": "1010101 First Street",
      "billing_address_2": "",
      "billing_city": "Manistee",
      "billing_state": "MI",
      "billing_postcode": "49660",
      "billing_phone": "555-555-5555",
      "shipping_first_name": "James",
      "shipping_last_name": "Doe",
      "shipping_company": "Roboswarm.dev",
      "shipping_country": "US",
      "shipping_address_1": "1010101 First Street",
      "shipping_address_2": "",
      "shipping_city": "Manistee",
      "shipping_state": "MI",
      "shipping_postcode": "49660",
      "order_comments": "",
      "shipping_method[0]": "flat_rate:1",
      "payment_method": "cod",
      "privacy_policy": "1",
      "terms": "on",
      "terms-field": "1",
    }, undefined, 4),
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

  editorOptions = {
    theme: 'vs-dark',
    language: 'json'
  };
  editorHasFocus = false;

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
    if (!this.isValid()) { return }

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

  hasOverrideDataAndIsInvalid(): boolean {
    if (this.model.data_override && this.model.data_override.trim() !== '') {
      if (this.isValidJson(this.model.data_override.trim())) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  private isValidJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch(e) {
      return false;
    }
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
    }
    if(!this.editorHasFocus && this.hasOverrideDataAndIsInvalid()) {
      this.error = 'Checkout override data must be a valid JSON object.';
      return false;
    }

    this.error = '';
    return true;
  }

}
