import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from '../../services/http.service';
import { SwarmService, Swarm } from '../../services/swarm.service';
import { timingSafeEqual } from 'crypto';
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
  swarm_ui_type: string;
}

@Component({
  selector: 'app-swarm-tile',
  templateUrl: './swarm-tile.component.html',
  styleUrls: ['./swarm-tile.component.css']
})
export class SwarmTileComponent implements OnInit {
  @Input() data: SwarmTile;
  private statusCheckInterval;

  constructor(private swarmService: SwarmService) {
  }

  ngOnInit() {
    if (this.data.status === 'new') {
      this.statusCheckInterval = setInterval(async () => {
        const swarm: Swarm = await this.swarmService.getById(this.data.id);
        if (swarm.status !== this.data.status) {
          this.data.status = swarm.status;
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
    console.log({ data: this.data });
    return `${commaNumber(this.data.swarmSize - 1)} + 1 master node`;
  }

  showDataButtons() {
    return this.data.status === 'ready';
  }

  getFormattedStatus() {
    switch (this.data.status) {
      case 'new':
        return 'Building Swarm';
      case 'ready':
        return 'Running';
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

  getFormattedSwarmType() {
    if (this.data.swarm_ui_type === 'locust') {
      return 'Locust Web UI';
    } else {
      return 'Headless';
    }
  }

  onDeleteCompleted(swarmId: number) {
    this.data.status = 'destroyed';
  }

  getFormattedRegion() {
    switch (this.data.region) {
      case 'sfo2':
        return 'San Francisco';
      case 'ams3':
        return 'Amsterdam';
      case 'blr1':
        return 'Bangalore';
      case 'fra1':
        return 'Frankfurt';
      case 'lon1':
        return 'London';
      case 'nyc3':
        return 'New York City';
      case 'sgp1':
        return 'Singapore';
      case 'tor1':
        return 'Toronto';
    }
  }

  showLocustButton(): boolean {
    return this.data.swarm_ui_type === 'locust' && this.data.status === 'ready';
  }

  showDetailButtons(): boolean {
    return this.data.status === 'ready' || this.data.status === 'destroyed';
  }
}
