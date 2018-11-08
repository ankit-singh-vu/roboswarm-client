import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  activeSection = 'welcome';

  constructor(private metrics: MetricsService) { }

  ngOnInit() {
    this.metrics.track('DOCUMENTATION_VIEW');
  }

  goToSection(sectionName) {
    this.metrics.track('DOCUMENTATION_GO_TO_SECTION', { sectionName });
    this.activeSection = sectionName;
  }

}
