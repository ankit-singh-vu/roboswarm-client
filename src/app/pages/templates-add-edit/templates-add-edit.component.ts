import { Component, OnInit } from '@angular/core';
import {
  TemplateService,
  WordPressRouteType,
  WordPressRoute,
  TemplateComplex } from '../../services/template.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WordPressRouteFields } from '../../components/wordpress-route/wordpress-route.component';

interface AddEditTemplate extends TemplateComplex {
  sitemapUrl: string;
  username?: string;
  password?: string;
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
    sitemapUrl: null,
    username: null,
    password: null
  };
  complexRoutes: WordPressRoute[] = [];
  tmpRoute =  '';
  id: number = null;
  saving = false;
  sitemapImportWorking = false;
  submitted = false;
  working = true;
  error = '';

  wordpressRouteTypes: WordPressRouteFields[] = [
    {
      name: 'Authenticated WordPress Frontend Browsing',
      description: 'Roboswarm will authenticate with a WordPress user and then navigate routes in your sitemap.xml file.',
      routeType: WordPressRouteType.AUTHENTICATED_FRONTEND_NAVIGATE,
      hasPassword: false,
      hasUsername: false,
      hasSitemap: false
    },
    {
      name: 'Authenticated WordPress Admin Browsing',
      description: 'Roboswarm will authenticate with a WordPress user and then navigate around the /wp-admin section of your site.',
      routeType: WordPressRouteType.AUTHENTICATED_ADMIN_NAVIGATE,
      hasPassword: false,
      hasUsername: false,
      hasSitemap: false
    },
    {
      name: 'Unauthenticated Wordpress Frontend Browsing',
      description: 'Roboswarm will browse all pages listed in your sitemap.xml file while not logged in.',
      routeType: WordPressRouteType.UNAUTHENTICATED_FRONTEND_NAVIGATE,
      hasPassword: false,
      hasUsername: false,
      hasSitemap: false
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
      const existingTemplate: TemplateComplex = await this.templateService.get(this.id);
      this.model.name = existingTemplate.name;
      this.model.sitemapUrl = existingTemplate.site_url;
      this.model.username = existingTemplate.username;
      this.model.password = existingTemplate.password;
      this.complexRoutes = existingTemplate.routes;
      this.onModelChange('site_url', this.model.sitemapUrl);
      this.onModelChange('username', this.model.username);
      this.onModelChange('password', this.model.password);
    }
    this.working = false;
  }

  canSave() {
    return this.model.name.trim() !== '' && this.complexRoutes.length > 0;
  }

  async onSubmit(form: NgForm) {
    this.saving = true;
    const data: TemplateComplex = {
      name: this.model.name,
      site_url: this.model.sitemapUrl,
      username: this.model.username,
      password: this.model.password,
      routes: this.complexRoutes
    };
    if (!this.id) {
      await this.templateService.create(data);
    } else {
      await this.templateService.update(this.id, data);
    }
    this.saving = false;
    this.router.navigate(['/template']);
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
    this.working = true;
    const existingItem: WordPressRoute = this.complexRoutes.find(r => r.routeType === routeType);
    if (existingItem) {
      this.working = false;
      return;
    }
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
    this.working = false;
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

  onModelChange(eventType: string, newValue: string) {
    const hasValue = newValue && newValue.trim() !== '';
    for (let i = 0; i < this.wordpressRouteTypes.length; i++) {
      if (eventType === 'site_url') {
        this.wordpressRouteTypes[i].hasSitemap = hasValue;
      }
      if (eventType === 'username') {
        this.wordpressRouteTypes[i].hasUsername = hasValue;
      }
      if (eventType === 'password') {
        this.wordpressRouteTypes[i].hasPassword = hasValue;
      }
    }
  }
}
