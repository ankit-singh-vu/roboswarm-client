import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AdvancedTemplateRoute, RouteMethod } from '../../services/template.service';
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
  requestBody: string = '';
  methods = [
    { value: 'GET', name: 'GET' },
    { value: 'POST', name: 'POST' },
    { value: 'PUT', name: 'PUT' },
    { value: 'PATCH', name: 'PATCH' },
    { value: 'DELETE', name: 'DELETE' }
  ]

  constructor() {}

  ngOnInit() {
    this.throttledOnChange = throttle(this.onChange, 500, { trailing: true });
    // TODO when component init break apart the advancedTemplateROute into
    // parts and set all the variables so form changes pick up.
    this.populateFields();
  }

  ngOnChanges() {
    this.populateFields();
  }

  private populateFields() {
    if (this.route) {
      this.method = this.route.method;
      this.path = this.route.path;
      const headers = this.route.headers.map(h => `${h.key}:${h.value}`);
      this.headers = headers.join("\n");
      const queryParams = this.route.queryParams.map(qp => `${qp.key}:${qp.value}`);
      this.queryParams = queryParams.join("\n");
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
      headers: this.getKeyValueFromString(this.headers),
      queryParams: this.getKeyValueFromString(this.queryParams)
    });
  }
}
