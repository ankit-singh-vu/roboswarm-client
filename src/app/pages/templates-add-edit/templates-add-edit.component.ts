import { Component, OnInit } from '@angular/core';
import { TemplateService, Template, TemplateRoute, TemplateHydrated } from '../../services/template.service';
import { NgForm } from '@angular/forms';
import { SiteOwnershipService, SiteOwnership } from '../../services/site-ownership.service';
import { Router, ActivatedRoute } from '@angular/router';

interface AddEditTemplate extends Template {
  routes: TemplateRoute[];
  sitemapUrl: string;
}

@Component({
  selector: 'app-templates-add-edit',
  templateUrl: './templates-add-edit.component.html',
  styleUrls: ['./templates-add-edit.component.css']
})
export class TemplatesAddEditComponent implements OnInit {
  model: AddEditTemplate = {
    name: '',
    routes: [],
    sitemapUrl: null
  };
  tmpRoute =  '';
  id: number = null;
  existingTemplate: TemplateHydrated = null;
  saving = false;
  sitemapImportWorking = false;
  submitted = false;
  working = true;
  error = '';

  constructor(private siteOwnershipService: SiteOwnershipService,
              private route: ActivatedRoute,
              private templateService: TemplateService,
              private router: Router) { }

  async ngOnInit() {
    this.working = true;
    const tmpId = this.route.snapshot.params?.id;
    this.id = tmpId ? parseInt(tmpId, 10) : null;
    if (this.id) {
      this.existingTemplate = await this.templateService.get(this.id);
      this.model.name = this.existingTemplate.name;
      this.model.routes = this.existingTemplate.routes;
    }
    this.working = false;
  }

  canSave() {
    return this.model.name.trim() !== ''
      && this.model.routes.length > 0;
  }

  async importFromSitemap() {
    this.sitemapImportWorking = true;
    const results = await this.templateService.getSitemap(this.model.sitemapUrl);
    const resultsWithId = results.map(r => {
      return {
        ...r,
        id: Math.floor(Math.random() * 1000000) * 23
      };
    });
    this.model.routes = this.model.routes.concat(resultsWithId);
    this.model.sitemapUrl = '';
    this.sitemapImportWorking = false;
  }

  async onSubmit(form: NgForm) {
    this.saving = true;
    if (!this.id) {
      await this.templateService.create(this.model.name, this.model.routes);
    } else {
      await this.templateService.update(this.id, this.model.routes);
    }
    this.saving = false;
    this.router.navigate(['/template']);
  }

  addTmpRoute($event: Event) {
    $event.stopImmediatePropagation();
    if (this.tmpRoute.trim() !== '') {
      this.model.routes.push({
        id: Math.floor(Math.random() * 1000000) * 56,
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

  trackByFn(index, item) {
    return (item.id);
  }

}
