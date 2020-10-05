import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WordPressRoute } from '../../services/template.service';

@Component({
  selector: 'app-edit-template-routes-modal',
  templateUrl: './edit-template-routes-modal.component.html',
  styleUrls: ['./edit-template-routes-modal.component.css']
})
export class EditTemplateRoutesModalComponent implements OnInit {
  @Input() routes: WordPressRoute;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
