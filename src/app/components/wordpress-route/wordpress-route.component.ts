import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WordPressRouteType } from '../../services/template.service';

export interface WordPressRouteFields {
  name: string;
  description: string;
  routeType: WordPressRouteType;
  hasSitemap: boolean;
  hasUsername: boolean;
  hasPassword: boolean;
}

@Component({
  selector: 'app-wordpress-route',
  templateUrl: './wordpress-route.component.html',
  styleUrls: ['./wordpress-route.component.css']
})
export class WordpressRouteComponent {
  @Input() fields: WordPressRouteFields;
  @Output() clicked = new EventEmitter<WordPressRouteType>();

  constructor() { }

  onClick() {
    this.clicked.emit(this.fields.routeType);
  }

  isEnabled(): boolean {
    switch (this.fields.routeType) {
      case WordPressRouteType.AUTHENTICATED_ADMIN_NAVIGATE: {
        return (
          this.fields.hasUsername &&
          this.fields.hasPassword
        );
      }
      case WordPressRouteType.AUTHENTICATED_FRONTEND_NAVIGATE: {
        return (
          this.fields.hasSitemap &&
          this.fields.hasUsername &&
          this.fields.hasPassword
        );
      }
      case WordPressRouteType.UNAUTHENTICATED_FRONTEND_NAVIGATE: {
        return this.fields.hasSitemap;
      }
    }
  }

  getDisabledReason(): string {
    switch (this.fields.routeType) {
      case WordPressRouteType.AUTHENTICATED_ADMIN_NAVIGATE: {
        return 'Username and Password are required for this scenario.';
      }
      case WordPressRouteType.AUTHENTICATED_FRONTEND_NAVIGATE: {
        return 'Username, Password, and Site URL are required for this scenario.';
      }
      case WordPressRouteType.UNAUTHENTICATED_FRONTEND_NAVIGATE: {
        return 'Site URL is required for this scenario.';
      }
    }
  }

}
