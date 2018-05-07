import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
const commaNumber = require('comma-number');

export interface SwarmTile {
  createdAt: Date;
  id: number;
  users: number;
  name: string;
  swarmSize: number;
  durationInSeconds: number;
  regions: Array<string>;
  status: string;
}

@Component({
  selector: 'app-swarm-tile',
  templateUrl: './swarm-tile.component.html',
  styleUrls: ['./swarm-tile.component.css']
})
export class SwarmTileComponent {
  @Input() data: SwarmTile;

  getFormattedUsers() {
    return commaNumber(this.data.users);
  }

  getFormattedDate() {
    return moment(this.data.createdAt).format('MMM D YYYY @ HH:mm A');
  }

  getFormattedDuration() {
    const hours = Math.floor(this.data.durationInSeconds / (60 * 60));
    const minutes = Math.floor((this.data.durationInSeconds - (hours * 60 * 60)) / 60);

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

  getFormattedRegions() {
    return this.data.regions.join(', ');
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
