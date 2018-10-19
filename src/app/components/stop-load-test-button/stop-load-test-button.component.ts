import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SwarmService } from '../../services/swarm.service';

@Component({
  selector: 'app-stop-load-test-button',
  templateUrl: './stop-load-test-button.component.html',
  styleUrls: ['./stop-load-test-button.component.css']
})
export class StopLoadTestButtonComponent {
  @Input() swarmId: number;
  @Input() swarmStatus: string;
  @Output() deleteCompleted = new EventEmitter<number>();

  working = false;

  constructor(private swarmService: SwarmService) {
  }

  showButton() {
    return this.swarmStatus === 'ready';
  }

  async stopTest() {
    this.working = true;
    await this.swarmService.destroy(this.swarmId);
    this.working = false;
    this.deleteCompleted.emit(this.swarmId);
  }
}
