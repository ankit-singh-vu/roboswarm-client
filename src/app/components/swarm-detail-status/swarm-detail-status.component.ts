import { Component, Input } from '@angular/core';
import { Swarm } from 'app/services/swarm.service';

@Component({
  selector: 'app-swarm-detail-status',
  templateUrl: './swarm-detail-status.component.html',
  styleUrls: ['./swarm-detail-status.component.css']
})
export class SwarmDetailStatusComponent {
  @Input() swarm: Swarm;

  constructor() { }

  loadTestRunning() {
    return this.swarm.ready_at && !this.swarm.destroyed_at;
  }

  loadTestStopped() {
    return this.swarm.ready_at && this.swarm.destroyed_at;
  }

  loadTestBroke() {
    return !this.swarm.ready_at;
  }


}
