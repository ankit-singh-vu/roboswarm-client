import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SwarmService } from '../../services/swarm.service';

@Component({
  selector: 'app-repeat-load-test',
  templateUrl: './repeat-load-test.component.html',
  styleUrls: ['./repeat-load-test.component.css']
})
export class RepeatLoadTestComponent {

  @Input() swarmId: number;
  @Input() swarmStatus: string;
  @Output() repeatCompleted = new EventEmitter<number>();

  working = false;

  constructor(private swarmService: SwarmService) {
  }

  showButton() {
    return this.swarmStatus === 'destroyed';
  }

  async repeatTest() {
    this.working = true;
    await this.swarmService.repeat(this.swarmId);
    this.working = false;
    this.repeatCompleted.emit(this.swarmId);
  }

}
