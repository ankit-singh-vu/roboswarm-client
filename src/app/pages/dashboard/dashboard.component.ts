import { Component, OnInit } from '@angular/core';
import { SwarmTile } from '../../components/swarm-tile/swarm-tile.component';
import { HttpService } from '../../services/http.service';
import { asTextData } from '@angular/core/src/view';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  swarms: Array<SwarmTile> = [];
  private http: HttpService;

  // TODO: Also restrict access to current user.
  constructor(_http: HttpService) {
    this.http = _http;
  }

  async ngOnInit() {
    const result = await this.http.request({
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/swarm'
    });
    if (!result.err && result.statusCode === 200) {
      result.data.forEach(swarm => {
        this.swarms.push({
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
        });
      });
    } else {
      console.log('There was an error fetching swarms.');
    }
  }

}
