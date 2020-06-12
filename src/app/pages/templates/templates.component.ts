import { Component, OnInit } from '@angular/core';
import { TemplateService, Template } from '../../services/template.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  loading = true;
  templates: Template[] = [];

  constructor(private templateService: TemplateService) { }

  async ngOnInit() {
    this.templates = await this.templateService.getAll();
    this.loading = false;
  }

}
