import { Component, OnInit } from '@angular/core';
import { SwarmTile } from '../../components/swarm-tile/swarm-tile.component';
import { SwarmService, Swarm } from '../../services/swarm.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  swarms: Array<SwarmTile> = [];
  loading: boolean;

  constructor(private swarmService: SwarmService) {
  }

  async ngOnInit() {
    this.loading = true;
    const swarms: Swarm[] = await this.swarmService.getAll();
    this.swarms = swarms.map(swarm => {
      return {
        id: swarm.id,
        createdAt: swarm.created_at,
        name: swarm.name,
        users: swarm.simulated_users,
        swarmSize: swarm.size,
        duration: swarm.duration,
        region: swarm.region,
        status: swarm.status,
        host_url: swarm.host_url,
        spawn_rate: swarm.spawn_rate,
        swarm_ui_type: swarm.swarm_ui_type
      };
    });
    this.loading = false;
  }

}
