import { Component, OnInit } from '@angular/core';
import { HttpService, HttpRequestOptions } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SwarmMetricsService } from '../../services/swarm-metrics.service';

@Component({
  selector: 'app-locust-web-ui',
  templateUrl: './locust-web-ui.component.html',
  styleUrls: ['./locust-web-ui.component.css']
})
export class LocustWebUiComponent implements OnInit {
  swarm;

  constructor(private http: HttpService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private swarmMetricsService: SwarmMetricsService) { }

  async ngOnInit() {
    const id = this.route.snapshot.params.id;
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/swarm/${id}`
    };
    const { data } = await this.http.request(options);
    this.swarm = data;
  }

  getSwarmAddress() {
    console.log(`http://${this.swarm.master_ip}:8089`);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`http://${this.swarm.master_ip}:8089`);
  }
}
