import { Component, OnInit } from '@angular/core';
import { Template, TemplateRoute } from '../../services/template.service';
import { NgForm } from '@angular/forms';
import { SiteOwnershipService, SiteOwnership } from '../../services/site-ownership.service';

interface AddEditTemplate extends Template {
  routes: TemplateRoute[];
}

@Component({
  selector: 'app-templates-add-edit',
  templateUrl: './templates-add-edit.component.html',
  styleUrls: ['./templates-add-edit.component.css']
})
export class TemplatesAddEditComponent implements OnInit {
  model: AddEditTemplate = {
    name: '',
    routes: []
  };
  tmpRoute: '';
  showRoutes: false;
  sites: SiteOwnership[] = [];
  submitted = false;
  working = true;
  error = '';

  constructor(private siteOwnershipService: SiteOwnershipService) { }

  async ngOnInit() {
    this.working = true;
    this.sites = await this.siteOwnershipService.getAll();
    this.working = false;
  }

  onSubmit(form: NgForm) {
    console.log(`Template name set: ${this.model.name}`);
  }

  addTmpRoute() {
    this.model.routes.push({
      method: 'GET',
      path: this.tmpRoute
    });
    this.tmpRoute = '';
  }

  allFieldsCompleted(): boolean {
    return this.model.name && this.model.name.trim() !== '';
  }

}
