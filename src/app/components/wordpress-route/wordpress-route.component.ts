import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WordPressRouteType } from '../../services/template.service';

@Component({
  selector: 'app-wordpress-route',
  templateUrl: './wordpress-route.component.html',
  styleUrls: ['./wordpress-route.component.css']
})
export class WordpressRouteComponent {
  @Input() name: string;
  @Input() description: string;
  @Input() routeType: WordPressRouteType;
  @Output() clicked = new EventEmitter<WordPressRouteType>();

  constructor() { }

  onClick() {
    this.clicked.emit(this.routeType);
  }

}
