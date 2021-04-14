import { Component, Output, EventEmitter } from '@angular/core';
import { SiteOwnershipService, SiteOwnership} from '../../services/site-ownership.service';
import { TemplateService, TemplateRoute, TemplateComplex, WordPressRouteType } from '../../services/template.service';
import { SwarmService, NewSwarm } from '../../services/swarm.service';

interface StartWizardForm {
  name: string;
  site_url: string;
  simulated_users: number;
}

@Component({
  selector: 'app-start-wizard',
  templateUrl: './start-wizard.component.html',
  styleUrls: ['./start-wizard.component.css']
})
export class StartWizardComponent {
  @Output() completed = new EventEmitter<boolean>();
  model: StartWizardForm = {
    name: '',
    site_url: null,
    simulated_users: 5
  };
  submitted = false;
  error = '';

  constructor(private _siteOwnershipService: SiteOwnershipService,
              private _templateService: TemplateService,
              private _swarmService: SwarmService) { }

  allFieldsCompleted(): boolean {
    return (this.model.name && this.model.name.trim() !== '') &&
      (this.model.simulated_users && this.model.simulated_users > 0) &&
      (this.model.site_url && this.model.site_url.trim() !== '');
  }

  async onSubmit(form) {
    this.error = '';
    this.submitted = true;
    if (form.valid) {
      // 1) Fetch sitemap template routes.
      const sitemapRoutes: TemplateRoute[] = await this._templateService.getSitemap(this.model.site_url);
      if (sitemapRoutes.length === 0) {
        this.error = 'Your site does not have a sitemap.xml file or Roboswarm was unable to access it. We use sitemaps to populate the load test and can\'t proceed without it.';
        this.submitted = false;
        return;
      }

      // 2) Create the load test template.
      const template: TemplateComplex = await this._templateService.create({
        name: `Unauthenticated Frontend: ${this.model.site_url}`,
        site_url: this.model.site_url,
        routes: [{
          routeType: WordPressRouteType.UNAUTHENTICATED_FRONTEND_NAVIGATE,
          routes: sitemapRoutes,
          sitemapUrl: this.model.site_url
        }]
      });
      if (!template) {
        this.error = 'There was an error creating your load test template. Please try again. If the error persists, reach out to jack@kernl.us.';
        this.submitted = false;
        return;
      }

      // 3) Create the site ownership entry.
      let site: SiteOwnership = await this._siteOwnershipService.create({ base_url: this.model.site_url });
      if (!site || !site.id) {
        const siteError = site as any;
        if (siteError && siteError.detail && siteError.detail.includes('already exists')) {
          const ownedSites: SiteOwnership[] = await this._siteOwnershipService.getAll();
          site = ownedSites.find(s => s.base_url === this.model.site_url);
        } else {
          this.error = 'There was an error creating your site ownership entry. Please try again. If the error persists, reach out to jack@kernl.us.';
          this.submitted = false;
          await this._templateService.delete(template.id);
          return;
        }
      }

      // 4) Start the load test.
      const swarmData: NewSwarm = {
        name: this.model.name,
        duration: 20,
        simulated_users: this.model.simulated_users,
        file_path: '',
        site_id: site.id,
        template_id: template.id,
        spawn_rate: 1,
        machines: [{ region: 'nyc3' }],
        region: 'nyc3',
        swarm_ui_type: 'headless',
        generate_test_from_template: true,
        is_woo_commerce_template: false
      };
      const swarmResult = await this._swarmService.createSwarm(swarmData);
      if (swarmResult.statusCode !== 201) {
        if (swarmResult.data) {
          this.error = swarmResult.data;
        } else {
          this.error = 'There was an error creating your load test. Please try again.';
        }
        this.submitted = false;
        await this._templateService.delete(template.id);
        await this._siteOwnershipService.delete(site.id);
        return;
      }

      // 5) Inform the dashboard that the test has started.
      this.completed.emit(true);
      this.submitted = false;
    } else {
      this.error = 'Your form data is invalid. Please try again.';
    }
  }
}
