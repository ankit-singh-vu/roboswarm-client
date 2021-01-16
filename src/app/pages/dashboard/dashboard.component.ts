import { Component, OnInit } from '@angular/core';
import { SwarmTile } from '../../components/swarm-tile/swarm-tile.component';
import { SwarmService, Swarm } from '../../services/swarm.service';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  swarms: Array<SwarmTile> = [];
  loading: boolean;

  // Pagination variables
  page = 1;
  totalSize = null;
  pageSize = 12;

  constructor(private swarmService: SwarmService,
              private metrics: MetricsService) {
  }

  async onPageChange(newPage: number) {
    this.page = newPage;
    const { swarms } = await this.swarmService.getPage(this.page);
    this.swarms = this.formatSwarmData(swarms);
  }

  async ngOnInit() {
    this.loading = true;
    const { swarms, totalSize } = await this.swarmService.getPage(this.page);
    this.swarms = this.formatSwarmData(swarms);
    this.totalSize = totalSize;
    this.metrics.track('DASHBOARD_VIEW');
    this.loading = false;
  }

  formatSwarmData(swarms: Swarm[]): SwarmTile[] {
    return swarms.map(swarm => {
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
  }

  onSwarmDeleted(swarmId: number) {
    this.swarms = this.swarms.filter(swarm => swarm.id !== swarmId);
  }

  async onStartWizardCompleted(success: boolean) {
    this.loading = true;
    const { swarms, totalSize } = await this.swarmService.getPage(this.page);
    this.swarms = this.formatSwarmData(swarms);
    this.totalSize = totalSize;
    this.loading = false;
  }
}
