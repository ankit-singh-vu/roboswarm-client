import { Component, OnInit } from '@angular/core';
import { SwarmService, LoadTestMetrics, Request, Distribution, Swarm } from '../../services/swarm.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-swarm-detail',
  templateUrl: './swarm-detail.component.html',
  styleUrls: ['./swarm-detail.component.css']
})
export class SwarmDetailComponent implements OnInit {
  id: number;
  timer: any; // Interval.
  distributionData: Distribution[] = [];
  swarm: Swarm;
  requestData: Request[] = [];
  previousDistributionIdMarker = 0;
  previousRequestIdMarker = 0;

  constructor(private swarmService: SwarmService,
              private route: ActivatedRoute) { }

  async ngOnInit() {
    this.id = parseInt(this.route.snapshot.params.id, 10);
    this.swarm = await this.swarmService.getById(this.id);
    const initialData: LoadTestMetrics = await this.swarmService.getMetrics(this.id);
    this.distributionData = this.distributionData.concat(initialData.distribution);
    this.requestData = this.requestData.concat(initialData.requests);
    this.previousDistributionIdMarker = this.distributionData[this.distributionData.length - 1].id;
    this.previousRequestIdMarker = this.requestData[this.requestData.length - 1].id;
    if (this.swarm.status === 'ready') {
      this.timer = setInterval(async () => {
        await this.fetchUpdatedMetrics();
      }, 3500);
    }
  }

  fetchUpdatedMetrics = async () => {
    this.swarm = await this.swarmService.getById(this.id);
    const data: LoadTestMetrics = await this.swarmService.getMetrics(
      this.id,
      this.previousDistributionIdMarker,
      this.previousRequestIdMarker
    );
    if (this.swarm.status !== 'ready') { clearInterval(this.timer); }
    this.distributionData = this.distributionData.concat(data.distribution);
    this.requestData = this.requestData.concat(data.requests);
    this.previousDistributionIdMarker = this.distributionData[this.distributionData.length - 1].id;
    this.previousRequestIdMarker = this.requestData[this.requestData.length - 1].id;
  }
}
