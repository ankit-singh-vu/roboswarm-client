import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AdvancedTemplatePersisted,
  AdvancedTemplateRoute,
  RouteMethod,
  RouteType,
  TemplateAuth,
  TemplateRoute,
  TemplateService } from '../../services/template.service';
import { v4 } from 'uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-template-flow',
  templateUrl: './template-flow.component.html',
  styleUrls: ['./template-flow.component.css']
})
export class TemplateFlowComponent implements OnInit {
  fileSelected = false;
  fileUploading = false;
  fileError: string = null;
  step: number = 1;
  testType: string;
  authUsers?: TemplateAuth[] = null;
  userCount: number = null;
  sitemapPath: string = null;
  sitemapImportWorking = false;
  saving = false;
  showSaveSuccess = false;
  authStep = false;

  name: string = null;
  routes: AdvancedTemplateRoute[] = [];

  selectedRoute?: AdvancedTemplateRoute;

  constructor(private templateService: TemplateService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  moveUp(index: number) {
    this.array_move(this.routes, index, index-1);
  }

  moveDown(index: number) {
    if (index !== this.routes.length - 1)
    this.array_move(this.routes, index, index+1);
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

  isAuthenticated(): boolean {
    return this.testType === 'admin' || this.testType === 'authenticated';
  }

  selectTestType(testType: string) {
    this.testType = testType;
    this.step = 2;
  }

  onRouteChange = (routeUpdate: AdvancedTemplateRoute) => {
    const index = this.routes.findIndex(r => r.id === routeUpdate.id)
    this.routes[index] = routeUpdate;
  }

  addRoute(type: string) {
    const routeType: RouteType = type === "auth" ? RouteType.AUTH : RouteType.BASIC;
    this.routes.push({
      id: v4(),
      method: RouteMethod.GET,
      path: '/',
      body: [],
      bodyType: null,
      headers: [],
      queryParams: [],
      routeType,
    });
    this.selectedRoute = this.routes[this.routes.length - 1];
    if (routeType === RouteType.AUTH) {
      this.authStep = true;
      this.routes[this.routes.length - 1].users = [];
      this.routes[this.routes.length - 1].path = "/wp-login.php";
      this.routes[this.routes.length - 1].method = RouteMethod.POST;
      this.routes[this.routes.length - 1].headers = [
        { key: "Accept-Encoding", value: "gzip, deflate" },
        { key: "Accept", value: "*/*" },
        { key: "Accept-Language", value: "en-us" },
        { key: "Content-Type", value: "application/x-www-form-urlencoded" },
        { key: "User-Agent", value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36" }
      ]
    }
  }

  deleteRoute(index: number) {
    if (this.selectedRoute.routeType === RouteType.AUTH) {
      this.authStep = false;
    }

    if (this.selectedRoute.id === this.routes[index].id) {
      this.selectedRoute = null;
      this.routes.splice(index, 1);
      this.selectedRoute = this.routes[0];
    } else {
      this.routes.splice(index, 1);
    }
  }

  selectRoute(index: number) {
    this.selectedRoute = this.routes[index];
  }

  async importFromWordPress(modalContent: TemplateRef<any>) {
    await this.modalService.open(modalContent);
  }

  importButtonDisabled() {
    return this.sitemapPath?.length === 0 || this.sitemapImportWorking === true;
  }

  private getPath(url: string): string {
    try {
      const u: URL = new URL(url);
      return url.replace(u.origin, "");
    } catch (err) {
      return url;
    }
  }

  async startImport() {
    this.sitemapImportWorking = true;
    const sitemapRoutes: TemplateRoute[] = await this.templateService.getSitemap(this.sitemapPath);
    const formattedRoutes: AdvancedTemplateRoute[] = sitemapRoutes.map(smr => {
      return {
          id: v4(),
          method: RouteMethod.GET,
          path: this.getPath(smr.path),
          headers: [],
          queryParams: [],
          body: [],
          bodyType: null,
          routeType: RouteType.BASIC
      };
    });
    this.routes = this.routes.concat(formattedRoutes);
    this.sitemapImportWorking = false;
    this.modalService.dismissAll();
    this.selectRoute(0);
  }

  async save() {
    this.saving = true;
    const dataToSave: AdvancedTemplatePersisted = {
      testType: this.testType,
      authUsers: this.authUsers,
      name: this.name,
      routes: this.routes
    };

    await this.templateService.advancedRouteCreate(dataToSave);

    this.saving = false;

    // Show save success and then clear after 5 seconds.
    this.showSaveSuccess = true;
    setTimeout(() => {
      this.showSaveSuccess = false;
    }, 3500);
  }

  userActionRequired(route: AdvancedTemplateRoute): boolean {
    return route.routeType === RouteType.AUTH && route.users?.length === 0;
  }

}
