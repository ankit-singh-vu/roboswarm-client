import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SwarmService, Swarm } from '../../services/swarm.service';

@Component({
  selector: 'app-locust-web-ui',
  templateUrl: './locust-web-ui.component.html',
  styleUrls: ['./locust-web-ui.component.css']
})
export class LocustWebUiComponent implements OnInit {
  swarm: Swarm;

  constructor(private route: ActivatedRoute,
              private swarmService: SwarmService,
              private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.swarm = await this.swarmService.getById(id);
  }

  getSwarmAddress() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`http://${this.swarm.master_ip}:8089`);
  }
}
