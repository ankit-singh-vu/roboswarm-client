import { Component, OnInit } from '@angular/core';
import { TemplateService, TemplateSimple } from '../../services/template.service';
import * as moment from 'moment';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  loading = true;
  templates: TemplateSimple[] = [];

  constructor(private templateService: TemplateService) { }

  async ngOnInit() {
    this.templates = await this.templateService.getAll();
    this.loading = false;
  }

  async deleteTemplate(id: number) {
    await this.templateService.delete(id);
    const index = this.templates.findIndex(t => t.id === id);
    this.templates.splice(index, 1);
  }

  getFormattedDate(d: Date): string {
    return moment(d).format('MMM D YYYY');
  }

  formatScenarioNames(names: string): string {
    return names.split(',').join(', ');
  }

}
