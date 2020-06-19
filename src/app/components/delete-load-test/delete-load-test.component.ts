import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private swarmService: SwarmService,
              private modalService: NgbModal) { }

  showButton() {
    return this.swarmStatus === 'destroyed';
  }

  deleteLoadTest(modalContent: TemplateRef<any>) {
    this.working = true;
    this.modalService
      .open(modalContent)
      .result
      .then(async () => {
        await this.swarmService.deleteLoadTest(this.swarmId);
        this.complete.emit(this.swarmId);
        this.working = false;
      }, () => {
        this.working = false;
      });
  }
}
