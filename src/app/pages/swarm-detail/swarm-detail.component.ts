import { Component, OnInit } from '@angular/core';
import { SwarmService, LoadTestMetrics, Request, Distribution, Swarm, Status } from '../../services/swarm.service';
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
  formattedResultData = [];

  // Request Chart
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Requests';
  view = [500, 300];

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

    this.formatData();
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
  }
  // [
  //   {
  //     "name": "Malawi",
  //     "series": [
  //       {
  //         "value": 2964,
  //         "name": "2016-09-14T15:49:26.317Z"
  //       },
  //       {
  //         "value": 6036,
  //         "name": "2016-09-14T23:38:41.884Z"
  //       },
  //       {
  //         "value": 2351,
  //         "name": "2016-09-18T20:09:36.433Z"
  //       },
  //       {
  //         "value": 4657,
  //         "name": "2016-09-22T16:48:39.006Z"
  //       },
  //       {
  //         "value": 5299,
  //         "name": "2016-09-18T15:41:05.691Z"
  //       }
  //     ]
  //   },
}
