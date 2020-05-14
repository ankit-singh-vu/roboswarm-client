import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SwarmService } from '../../services/swarm.service';

@Component({
  selector: 'app-delete-load-test',
  templateUrl: './delete-load-test.component.html',
  styleUrls: ['./delete-load-test.component.css']
})
export class DeleteLoadTestComponent {
  @Input() swarmId: number;
  @Input() swarmStatus: string;
  @Output() complete = new EventEmitter<number>();

  working = false;

  constructor(private swarmService: SwarmService) { }

  showButton() {
    return this.swarmStatus === 'destroyed';
  }

  async deleteLoadTest() {
    this.working = true;
    await this.swarmService.deleteLoadTest(this.swarmId);
    this.working = false;
    this.complete.emit(this.swarmId);
  }
}
