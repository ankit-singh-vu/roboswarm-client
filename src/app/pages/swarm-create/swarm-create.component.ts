import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwarmService, NewMachine, NewSwarm } from '../../services/swarm.service';
import { RequestResult } from '../../services/http.service';
import { MetricsService } from '../../services/metrics.service';
import { SiteOwnership, SiteOwnershipService } from '../../services/site-ownership.service';
import { TemplateService, TemplateSimple } from '../../services/template.service';
import * as moment from 'moment';

interface CreateSwarmForm {
  name: string;
  simulated_users: number;
  swarm_size: number;
  duration_hours: number;
  duration_minutes: number;
  swarm_region: string[];
  site_id: number;
  template: TemplateSimple;
  spawn_rate: number;
  swarm_ui_type?: string;
  generate_test_from_template?: boolean;
}

@Component({
  selector: 'app-swarm-create',
  templateUrl: './swarm-create.component.html',
  styleUrls: ['./swarm-create.component.css']
})
export class SwarmCreateComponent implements OnInit {
  model: CreateSwarmForm = {
    name: '',
    simulated_users: 50,
    swarm_size: 1,
    duration_hours: 1,
    duration_minutes: 30,
    swarm_region: ['nyc3'],
    spawn_rate: 1,
    site_id: null,
    template: null,
    swarm_ui_type: 'headless',
    generate_test_from_template: true
  };
  regions = [
    { value: 'ams3', name: 'Amsterdam' },
    { value: 'blr1', name: 'Bangalore' },
    { value: 'fra1', name: 'Frankfurt' },
    { value: 'lon1', name: 'London' },
    { value: 'nyc3', name: 'New York City' },
    { value: 'sfo2', name: 'San Francisco' },
    { value: 'sgp1', name: 'Singapore' },
    { value: 'tor1', name: 'Toronto' },
  ];
  submitted = false;
  error = '';
  test_type = 'headless';
  sites: SiteOwnership[] = [];
  templates: TemplateSimple[] = [];

  constructor(private router: Router,
              private swarmService: SwarmService,
              private metrics: MetricsService,
              private templateService: TemplateService,
              private siteOwnershipService: SiteOwnershipService) {
  }

  async ngOnInit() {
    this.metrics.track('SWARM_CREATE_VIEW');
    this.sites = await await this.siteOwnershipService.getAll();
    const templates = await this.templateService.getAll();
    const wooTemplates = await this.templateService.getAllWooCommerce();
    wooTemplates.forEach(wt => {
      const createdAt: moment.Moment = moment(wt.created_at);
      templates.push({
        id: wt.id,
        name: `[WooCommerce] ${wt.name} - ${createdAt.format('MM/DD/YYYY')}`,
        created_at: wt.created_at,
        is_woo_commerce: true
      });
    });
    this.templates = templates;
  }

  async onSubmit(form) {
    this.error = '';
    if (form.valid) {
      this.submitted = true;
      this.error = '';

      try {
        const MACHINE_CPUS = 2;
        let totalMachines = Math.ceil(this.model.simulated_users / (1200 * MACHINE_CPUS));
        if (this.model.swarm_region.length > totalMachines) {
          totalMachines = this.model.swarm_region.length;
        }

        // Rotate through the regions, evenly distributing machines.
        const machines: NewMachine[] = [];
        for (let i = 0; i < totalMachines; i++) {
          const currentRegion = this.model.swarm_region.pop();
          machines.push({ region: currentRegion });
          this.model.swarm_region.unshift(currentRegion);
        }

        // Create the swarm.
        const swarmData: NewSwarm  = {
          name: this.model.name,
          simulated_users: this.model.simulated_users,
          machines,
          file_path: '',
          spawn_rate: this.model.spawn_rate,
          site_id: this.model.site_id,
          template_id: this.model.template.id,
          is_woo_commerce_template: this.model.template.is_woo_commerce,
          region: this.model.swarm_region.join(','),
          duration: this.model.duration_minutes,
          swarm_ui_type: this.test_type,
          generate_test_from_template: this.model.generate_test_from_template
        };

        const result: RequestResult = await this.swarmService.createSwarm(swarmData);
        if (result.statusCode === 201) {
          this.metrics.track('SWARM_CREATE_SUCCESS', { swarmData });
          this.router.navigate(['/dashboard']);
        } else {
          this.metrics.track('SWARM_CREATE_FAILURE', { swarmData });
          this.error = result.data;
        }
      } catch (err) {
        this.error = 'There was an error creating your load test. Please try again.';
      }
    } else {
      this.metrics.track('SWARM_CREATE_INVALID');
      this.error = 'Invalid form data. Please make sure all fields are completed.';
    }
    this.submitted = false;
  }

  allFieldsCompleted() {
    if (this.model.simulated_users === undefined || this.model.simulated_users <= 0) {
      return false;
    }
    if (this.model.duration_minutes === undefined || this.model.duration_minutes < 0) {
      return false;
    }
    return true;
  }
}
