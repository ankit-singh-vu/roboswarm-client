import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdvancedTemplateRoute, RouteMethod, TemplateAuth, TemplateRoute, TemplateService } from '../../services/template.service';
import { v4 } from 'uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UrlResolver } from '@angular/compiler';

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

  routes: AdvancedTemplateRoute[] = [];
  selectedRoute?: AdvancedTemplateRoute;

  constructor(private templateService: TemplateService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  isAuthenticated(): boolean {
    return this.testType === 'admin' || this.testType === 'authenticated';
  }

  selectTestType(testType: string) {
    this.testType = testType;
    this.step = 2;
  }

  proceedToTemplateCreation() {
    this.step = 3;
  }

  async onFileSelected(event) {
    this.fileSelected = true;
    this.fileUploading = true;
    this.fileError = null;

    const file:File = event.target.files[0];
    if (file) {
        const data = new FormData();
        data.append("loadTestAuthData", file);
        this.authUsers = await this.templateService.uploadAuthFile(data);
        this.userCount = this.authUsers.length;
    } else {
      this.fileError = 'No file selected.';
      this.fileSelected = false;
    }

    this.fileUploading = false;
  }

  onRouteChange = (routeUpdate: AdvancedTemplateRoute) => {
    const index = this.routes.findIndex(r => r.id === routeUpdate.id)
    this.routes[index] = routeUpdate;
  }

  addRoute(routeType: string) {
    this.routes.push({
      id: v4(),
      method: RouteMethod.GET,
      path: '/',
      headers: [],
      queryParams: []
    });
    this.selectedRoute = this.routes[this.routes.length - 1];
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
          queryParams: []
      };
    });
    this.routes = this.routes.concat(formattedRoutes);
    this.sitemapImportWorking = false;
    this.modalService.dismissAll();
    this.selectRoute(0);
  }
}
