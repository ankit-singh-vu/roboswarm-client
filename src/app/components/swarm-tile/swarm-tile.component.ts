import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from '../../services/http.service';
const commaNumber = require('comma-number');

export interface SwarmTile {
  createdAt: Date;
  id: number;
  users: number;
  name: string;
  swarmSize: number;
  duration: number;
  region: string;
  status: string;
  host_url: string;
  spawn_rate: number;
}

@Component({
  selector: 'app-swarm-tile',
  templateUrl: './swarm-tile.component.html',
  styleUrls: ['./swarm-tile.component.css']
})
export class SwarmTileComponent implements OnInit {
  @Input() data: SwarmTile;
  private http: HttpService;
  private statusCheckInterval;

  constructor(_http: HttpService) {
    this.http = _http;
  }

  ngOnInit() {
    if (this.data.status === 'new') {
      this.statusCheckInterval = setInterval(async () => {
        const result = await this.http.request({
          authenticated: true,
          requestType: 'GET',
          url: `/api/v1/swarm/${this.data.id}`
        });
        if (result.data.status !== this.data.status) {
          this.data.status = result.data.status;
          clearInterval(this.statusCheckInterval);
        }
        console.log(`Checking status for ${this.data.id}`);
      }, 5000);
    }
  }

  getFormattedUsers() {
    return commaNumber(this.data.users);
  }

  getFormattedDate() {
    return moment(this.data.createdAt).format('MMM D YYYY @ HH:mm A');
  }

  getFormattedDuration() {
    const hours = Math.floor(this.data.duration / 60);
    const minutes = Math.floor(this.data.duration - (hours * 60));

    let formattedString = '';
    if (hours === 1) {
      formattedString += '1 hour +';
    } else if (hours > 1) {
      formattedString += `${hours} hours +`;
    }

    if (minutes === 1) {
      formattedString += ' 1 min';
    } else if (minutes > 1) {
      formattedString += ` ${minutes} mins`;
    } else {
      formattedString = formattedString.substring(0, formattedString.length - 1);
    }

    return formattedString;
  }

  getFormattedSwarmSize() {
    return commaNumber(this.data.swarmSize);
  }

  getFormattedStatus() {
    switch (this.data.status) {
      case 'new':
        return 'Building Swarm';
      case 'ready':
        return 'Starting Load Test';
      case 'destroyed':
        return 'Swarm Destroyed';
      default:
        return 'Error';
    }
  }

  getStatusClass() {
    switch (this.data.status) {
      case 'new':
        return 'warning';
      case 'ready':
        return 'primary';
      case 'destroyed':
        return 'success';
      default:
        return 'danger';
    }
  }

  onDeleteCompleted(swarmId: number) {
    this.data.status = 'destroyed';
  }
}
