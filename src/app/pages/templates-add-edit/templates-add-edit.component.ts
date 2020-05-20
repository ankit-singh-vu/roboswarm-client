import { Component, OnInit } from '@angular/core';
import { Template, TemplateRoute } from '../../services/template.service';

interface AddEditTemplate extends Template {
  routes: TemplateRoute[];
}

@Component({
  selector: 'app-templates-add-edit',
  templateUrl: './templates-add-edit.component.html',
  styleUrls: ['./templates-add-edit.component.css']
})
export class TemplatesAddEditComponent implements OnInit {
  model: AddEditTemplate = {
    name: '',
    routes: []
  };
  submitted = false;
  error = '';

  constructor() { }

  ngOnInit(): void {
  }

}
