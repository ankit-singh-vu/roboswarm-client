import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WordPressRoute, TemplateRoute } from '../../services/template.service';

@Component({
  selector: 'app-edit-template-routes-modal',
  templateUrl: './edit-template-routes-modal.component.html',
  styleUrls: ['./edit-template-routes-modal.component.css']
})
export class EditTemplateRoutesModalComponent {
  @Input() routes: WordPressRoute;

  newRoutePath = '';

  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.dismiss();
  }

  add() {
    this.routes.routes.unshift({
      id: Math.floor(Math.random() * Math.random() * 1000),
      method: 'GET',
      path: `${this.newRoutePath}`
    });
    this.newRoutePath = '';
  }

  remove(route: TemplateRoute) {
    const index = this.routes.routes.findIndex(item => item.id === route.id);
    this.routes.routes.splice(index, 1);
  }

  save() {
    this.activeModal.close(this.routes);
  }

}
