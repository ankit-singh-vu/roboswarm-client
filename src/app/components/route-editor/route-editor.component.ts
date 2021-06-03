import { Component, Input, OnInit } from '@angular/core';
import { AdvancedTemplateRoute, RouteMethod } from '../../services/template.service';
import { DebouncedFunc, throttle } from 'lodash';

@Component({
  selector: 'app-route-editor',
  templateUrl: './route-editor.component.html',
  styleUrls: ['./route-editor.component.css']
})
export class RouteEditorComponent implements OnInit {

  @Input() route: AdvancedTemplateRoute;
  @Input() onChange: any;

  throttledOnChange: DebouncedFunc<any>;

  method: RouteMethod;
  path: string;
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
  }

  onDataChange() {
    this.throttledOnChange({
      ...this.route,
      path: this.path,
      method: this.method
    });
  }

  getRouteMethods() {
    return Object.values(RouteMethod);
  }

}
