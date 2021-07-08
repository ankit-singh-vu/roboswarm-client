import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AdvancedTemplateRoute, RouteMethod, TemplateAuth, TemplateService } from '../../services/template.service';
import { DebouncedFunc, throttle } from 'lodash';

@Component({
  selector: 'app-route-editor',
  templateUrl: './route-editor.component.html',
  styleUrls: ['./route-editor.component.css']
})
export class RouteEditorComponent implements OnInit, OnChanges {

  @Input() route: AdvancedTemplateRoute;
  @Input() onChange: any;

  throttledOnChange: DebouncedFunc<any>;
  activeTab = 1;
  method: RouteMethod;
  path: string;
  headers: string = '';
  queryParams: string = '';
  body: string = '';
  bodyType: string = '';
  bodyTypes = [
    { value: 'application/x-www-form-urlencoded', name: 'Form Encoded (application/x-www-form-urlencoded)' },
    { value: 'application/json', name: 'JSON Encoded (application/json)' }
  ];
  methods = [
    { value: 'GET', name: 'GET' },
    { value: 'POST', name: 'POST' },
    { value: 'PUT', name: 'PUT' },
    { value: 'PATCH', name: 'PATCH' },
    { value: 'DELETE', name: 'DELETE' }
  ]
  fileSelected = false;
  fileUploading = false;
  fileError: string = null;
  authUsers?: TemplateAuth[] = null;
  userCount: number = null;

  constructor(private templateService: TemplateService) {}

  ngOnInit() {
    this.throttledOnChange = throttle(this.onChange, 500, { trailing: true });
    this.populateFields();
  }

  ngOnChanges() {
    this.populateFields();
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
    this.onDataChange();
  }

  private populateFields() {
    if (this.route) {
      this.method = this.route.method;
      this.path = this.route.path;
      this.bodyType = this.route.bodyType;
      this.authUsers = this.route.users;
      if (this.route.headers?.length > 0) {
        this.headers = this.route.headers
          .map(h => `${h.key}:${h.value}`)
          .join("\n");
      } else {
        this.headers = '';
      }

      if (this.route.queryParams?.length > 0) {
        this.queryParams = this.route.queryParams
          .map(qp => `${qp.key}:${qp.value}`)
          .join("\n");
      } else {
        this.queryParams = '';
      }

      if (this.route.body?.length > 0) {
        this.body = this.route.body
        .map(b => `${b.key}:${b.value}`)
        .join("\n");
      } else {
        this.body = '';
      }
    }
  }

  getKeyValueFromString(data: string): { key: string; value: string; }[] {
    return data
      .split(/\r?\n/)
      .filter(d => d.split(':').length === 2)
      .map(d => {
        const arr = d.split(':');
        return { key: arr[0], value: arr[1] };
      });
  }

  onDataChange() {
    this.throttledOnChange({
      ...this.route,
      path: this.path,
      method: this.method,
      bodyType: this.bodyType,
      users: this.authUsers,
      body: this.getKeyValueFromString(this.body),
      headers: this.getKeyValueFromString(this.headers),
      queryParams: this.getKeyValueFromString(this.queryParams)
    });
  }
}
