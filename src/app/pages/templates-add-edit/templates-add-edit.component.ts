import { Component, OnInit } from '@angular/core';
import { TemplateService, Template, TemplateRoute, TemplateHydrated, WordPressRouteType } from '../../services/template.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface AddEditTemplate extends Template {
  routes: TemplateRoute[];
  sitemapUrl: string;
}

interface WordPressRouteTemplate {
  name: string;
  description: string;
  routeType: WordPressRouteType;
}

interface WordPressRoute {
  routeType: WordPressRouteType;
  routes: TemplateRoute[];
  sitemapUrl?: string;
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
  complexRoutes: WordPressRoute[] = [];
  tmpRoute =  '';
  id: number = null;
  existingTemplate: TemplateHydrated = null;
  saving = false;
  sitemapImportWorking = false;
  submitted = false;
  working = true;
  error = '';
  wordpressRouteTypes: WordPressRouteTemplate[] = [
    {
      name: 'Authenticated WordPress Frontend Browsing',
      description: 'Roboswarm will authenticate with a WordPress user and then navigate routes in your sitemap.xml file.',
      routeType: WordPressRouteType.AUTHENTICATED_FRONTEND_NAVIGATE
    },
    {
      name: 'Authenticated WordPress Admin Browsing',
      description: 'Roboswarm will authenticate with a WordPress user and then navigate around the /wp-admin section of your site.',
      routeType: WordPressRouteType.AUTHENTICATED_ADMIN_NAVIGATE
    },
    {
      name: 'Unauthenticated Wordpress Frontend Browsing',
      description: 'Roboswarm will browse all pages listed in your sitemap.xml file while not logged in.',
      routeType: WordPressRouteType.UNAUTHENTICATED_FRONTEND_NAVIGATE
    }
  ];

  constructor(private route: ActivatedRoute,
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
      await this.templateService.update(this.id, this.model.name, this.model.routes);
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

  async onWpRouteAdd(routeType: WordPressRouteType) {
    switch (routeType) {
      case WordPressRouteType.AUTHENTICATED_ADMIN_NAVIGATE:
        this.complexRoutes.push({
          routeType,
          routes: [
            { method: 'GET', path: '/wp-admin/index.php' },
            { method: 'GET', path: '/wp-admin/edit.php' },
            { method: 'GET', path: '/wp-admin/edit-tags.php' },
            { method: 'GET', path: '/wp-admin/upload.php' },
            { method: 'GET', path: '/wp-admin/edit.php?post_type=page' },
            { method: 'GET', path: '/wp-admin/edit-comments.php' },
            { method: 'GET', path: '/wp-admin/profile.php' },
            { method: 'GET', path: '/wp-admin/edit-comments.php' },
          ],
        });
        break;
      case WordPressRouteType.AUTHENTICATED_FRONTEND_NAVIGATE:
        this.complexRoutes.push({
          routeType,
          routes: await this.templateService.getSitemap(this.model.sitemapUrl)
        });
        break;
      case WordPressRouteType.UNAUTHENTICATED_FRONTEND_NAVIGATE:
        this.complexRoutes.push({
          routeType,
          routes: await this.templateService.getSitemap(this.model.sitemapUrl)
        });
        break;
    }
    /*
    Todo:
      # next: display these 'complex routes' in the template area. They should
             just be boxes like they are now, with a remove button instead.
      - In the area to add templates, need to make sure we can't select
        WP frontend routes without sitemap and that we can't select authenticated
        routes with username/password. Will need UI for username/password.
      - next+1: Need to serialize the complex route object and POST it to the
            backend. Save these as JSON maybe?
      - Allow user to select percentage of traffic that will use specific route
        types. default to even split, but allow to change so long as it adds up
        to 100. <---- NOT MVP
    */
  }

  private hasModelRoutes(): boolean {
    return this.model.routes && this.model.routes.length > 0;
  }

  private hasComplexRoutes(): boolean {
    return this.complexRoutes && this.complexRoutes.length > 0;
  }

  hasRoutes(): boolean {
    return this.hasModelRoutes() || this.hasComplexRoutes();
  }

  deleteComplexRouteAtIndex(i: number): void {
    this.complexRoutes.splice(i, 1);
  }

  getWordPressRouteTypeName(routeType: WordPressRouteType): string {
    return this.templateService.getWordPressRouteTypeName(routeType);
  }
}
