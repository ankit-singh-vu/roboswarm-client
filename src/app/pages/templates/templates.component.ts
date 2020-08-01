import { Component, OnInit } from '@angular/core';
import { TemplateService, TemplateSimple } from '../../services/template.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetricsService } from 'app/services/metrics.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  loading = true;
  templates: TemplateSimple[] = [];

  constructor(private templateService: TemplateService,
              private modalService: NgbModal,
              private metricsService: MetricsService) { }

  async ngOnInit() {
    this.templates = await this.templateService.getAll();
    this.metricsService.track('TEMPLATES_VIEW');
    this.loading = false;
  }

  async deleteTemplate(content: any, id: number) {
    try {
      const result = await this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result;
      if (result === 'continue') {
        await this.templateService.delete(id);
        const index = this.templates.findIndex(t => t.id === id);
        this.templates.splice(index, 1);
        this.metricsService.track('TEMPLATES_DELETE');
      }
    } catch (err) { /* no-op */ }
  }

  getFormattedDate(d: Date): string {
    return moment(d).format('MMM D YYYY');
  }

  formatScenarioNames(names: string): string {
    return names.split(',').join(', ');
  }

}
