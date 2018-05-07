import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-stop-load-test-button',
  templateUrl: './stop-load-test-button.component.html',
  styleUrls: ['./stop-load-test-button.component.css']
})
export class StopLoadTestButtonComponent {
  @Input() swarmId: number;
  @Input() swarmStatus: string;
  @Output() deleteCompleted = new EventEmitter<number>();

  private http: HttpService;
  private working = false;

  constructor(_http: HttpService) {
    this.http = _http;
  }

  showButton() {
    return this.swarmStatus === 'ready';
  }

  async stopTest() {
    this.working = true;
    const response = await this.http.request({
      authenticated: true,
      requestType: 'DELETE',
      url: `/api/v1/swarm/${this.swarmId}`
    });
    this.working = false;
    this.deleteCompleted.emit(this.swarmId);
  }
}
