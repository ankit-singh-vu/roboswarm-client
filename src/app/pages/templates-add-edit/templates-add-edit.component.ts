import { Component, OnInit } from '@angular/core';
import { TemplateService, Template, TemplateRoute } from '../../services/template.service';
import { NgForm } from '@angular/forms';
import { SiteOwnershipService, SiteOwnership } from '../../services/site-ownership.service';
import { Router } from '@angular/router';

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
  tmpRoute =  '';
  saving = false;
  sites: SiteOwnership[] = [];
  submitted = false;
  working = true;
  error = '';

  constructor(private siteOwnershipService: SiteOwnershipService,
              private templateService: TemplateService,
              private router: Router) { }

  async ngOnInit() {
    this.working = true;
    this.sites = await this.siteOwnershipService.getAll();
    this.working = false;
  }

  canSave() {
    return this.model.name.trim() !== ''
      && this.model.routes.length > 0;
  }

  async onSubmit(form: NgForm) {
    this.saving = true;
    await this.templateService.create(this.model.name, this.model.routes);
    this.saving = false;
    this.router.navigate(['/template']);
  }

  addTmpRoute() {
    if (this.tmpRoute.trim() !== '') {
      this.model.routes.push({
        method: 'GET',
        path: this.tmpRoute
      });
      this.tmpRoute = '';
    }
  }

  allFieldsCompleted(): boolean {
    return this.model.name && this.model.name.trim() !== '';
  }

  deleteRouteAtIndex(i: number) {
    this.model.routes.splice(i, 1);
  }

}
