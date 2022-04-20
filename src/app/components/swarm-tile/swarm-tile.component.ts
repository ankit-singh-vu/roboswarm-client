import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { SwarmService, Swarm } from '../../services/swarm.service';
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
  @Output() deleted = new EventEmitter<number>();

  private statusCheckInterval;
  private timeRemainingSeconds;
  private timeRemainingInterval;

  constructor(private swarmService: SwarmService) { }

  async ngOnInit() {
    if (this.data.status === 'new') {
      this.statusCheckInterval = setInterval(async () => {
        const swarm: Swarm = await this.swarmService.getById(this.data.id);
        if (swarm.status !== this.data.status) {
          this.data.status = swarm.status;
          clearInterval(this.statusCheckInterval);
          clearInterval(this.timeRemainingInterval);
        }
      }, 5000);
      this.timeRemainingSeconds = await this.swarmService.getTimeRemaining(this.data.id);
      this.timeRemainingInterval = setInterval(() => {
        if (this.timeRemainingSeconds < 1) {
          clearInterval(this.timeRemainingInterval);
        } else {
          this.timeRemainingSeconds--;
        }
      }, 1000);

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

  showDataButtons() {
    return this.data.status === 'ready';
  }

  getTimeRemaining() {
    if (this.data.status == 'new') {
      if (this.timeRemainingSeconds > 1) {
        return `~${parseInt(this.timeRemainingSeconds, 10)} seconds`;
      } else {
        return 'Any second now...';
      }
    }
  }

  getFormattedStatus() {
    switch (this.data.status) {
      case 'new':
        return `Deploying Infrastructure (${this.getTimeRemaining()})`;
      case 'ready':
        return 'Running Load Test';
      case 'destroyed':
        return 'Load Test Completed';
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

  onStopCompleted(swarmId: number) {
    this.data.status = 'destroyed';
  }

  onSoftDelete(swarmId: number) {
    this.deleted.emit(swarmId);
  }

  getFormattedRegion() {
    return this.swarmService.getFormattedRegion(this.data.region);
  }

  showDetailButtons(): boolean {
    return this.data.status === 'ready' || this.data.status === 'destroyed';
  }
}
