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
        const then = moment(swarm.created_at);
        const durationInSeconds = moment.duration(moment().diff(then)).asSeconds();
        this.swarms.push({
          createdAt: swarm.created_at,
          users: swarm.simulated_users,
          swarmSize: swarm.size,
          durationInSeconds,
          regions: ['tmp'],
          status: swarm.status,
        });
      });
    } else {
      debugger;
      console.log('There was an error fetching swarms.');
    }
  }

}
