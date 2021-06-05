import { Component, OnInit } from '@angular/core';
import { AdvancedTemplateRoute, RouteMethod, TemplateAuth, TemplateService } from '../../services/template.service';
import { v4 } from 'uuid';

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

  routes: AdvancedTemplateRoute[] = [];
  selectedRoute?: AdvancedTemplateRoute;

  constructor(private templateService: TemplateService) { }

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
}
