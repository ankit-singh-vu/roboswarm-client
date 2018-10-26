import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  SwarmService,
  LoadTestMetrics,
  Request,
  Distribution,
  Swarm,
  Status,
  DistributionFinal,
  RequestFinal, 
  LoadTestMetricsFinal} from '../../services/swarm.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-swarm-detail',
  templateUrl: './swarm-detail.component.html',
  styleUrls: ['./swarm-detail.component.css']
})
export class SwarmDetailComponent implements OnInit, OnDestroy {
  id: number;
  timer: any; // Interval.
  distributionData: Distribution[] = [];
  distributionDataFinal: DistributionFinal[] = [];
  requestData: Request[] = [];
  requestDataFinal: RequestFinal[] = [];
  swarm: Swarm;
  previousDistributionIdMarker = 0;
  previousRequestIdMarker = 0;
  formattedResultData = [];
  formattedDistributionData = [];

  // Request Chart
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Requests';
  view = [500, 300];

  // Distribution Chart
  distributionXAxisLabel = 'Request Percentiles';
  distributionYAxisLabel = '# of Requests';

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

    if (this.swarm.status === 'destroyed') {
      await this.fetchFinalMetrics();
    }

    this.formatData();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  fetchFinalMetrics = async () => {
    const result: LoadTestMetricsFinal = await this.swarmService.getMetricsFinal(this.id);
    this.distributionDataFinal = result.distribution;
    this.requestDataFinal = result.requests;
  }

  fetchUpdatedMetrics = async () => {
    this.swarm = await this.swarmService.getById(this.id);
    const data: LoadTestMetrics = await this.swarmService.getMetrics(
      this.id,
      this.previousDistributionIdMarker,
      this.previousRequestIdMarker
    );
    if (this.swarm.status !== 'ready') {
      clearInterval(this.timer);
      await this.fetchFinalMetrics();
    }
    this.distributionData = this.distributionData.concat(data.distribution);
    this.requestData = this.requestData.concat(data.requests);
    this.previousDistributionIdMarker = this.distributionData[this.distributionData.length - 1].id;
    this.previousRequestIdMarker = this.requestData[this.requestData.length - 1].id;
    this.formatData();
  }

  async onDeleteCompleted(evt: any) {
    this.swarm.status = Status.destroyed;
    clearInterval(this.timer);
  }

  formatData() {
    // Take the distribution data and the request data and put into format.
    this.formattedResultData = [
      {
        name: 'Requests / second',
        series: this.requestData.map(r => {
          return {
            value: r.requests_per_second,
            name: new Date(r.created_at)
          };
        })
      },
      {
        name: 'Failures',
        series: this.requestData.map(r => {
          return {
            value: r.failures,
            name: new Date(r.created_at)
          };
        })
      }
    ];

    const i = this.distributionData.length - 1;
    if (i > 1 && this.distributionData[i].percentiles['50%'] !== 'N/A') {
      this.formattedDistributionData = [
        { name: '50%', value: this.distributionData[i].percentiles['50%'] },
        { name: '66%', value: this.distributionData[i].percentiles['66%'] },
        { name: '75%', value: this.distributionData[i].percentiles['75%'] },
        { name: '80%', value: this.distributionData[i].percentiles['80%'] },
        { name: '90%', value: this.distributionData[i].percentiles['90%'] },
        { name: '95%', value: this.distributionData[i].percentiles['95%'] },
        { name: '98%', value: this.distributionData[i].percentiles['98%'] },
        { name: '99%', value: this.distributionData[i].percentiles['99%'] },
        { name: '100%', value: this.distributionData[i].percentiles['100%'] }
      ];
    }
  }
}
