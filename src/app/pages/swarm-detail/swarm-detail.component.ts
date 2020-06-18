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
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MetricsService } from '../../services/metrics.service';

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
  formattedFailureData = [];
  formattedResultData = [];
  formattedDistributionData = [];
  loading: boolean;

  // Request Chart
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Requests';
  view = [500, 300];

  // Distribution Chart
  distributionXAxisLabel = '% of requests completed in N milliseconds';
  distributionYAxisLabel = 'Time in milliseconds';

  constructor(private swarmService: SwarmService,
              private route: ActivatedRoute,
              private router: Router,
              private metrics: MetricsService) { }

  async ngOnInit() {
    this.loading = true;
    this.id = parseInt(this.route.snapshot.params.id, 10);
    this.swarm = await this.swarmService.getById(this.id);
    const initialData: LoadTestMetrics = await this.swarmService.getMetrics(this.id);
    this.distributionData = initialData.distribution.reverse();
    this.requestData = initialData.requests.reverse();
    this.metrics.track('SWARM_DETAIL_VIEW', { id: this.id });

    if (this.distributionData && this.distributionData.length > 0) {
      this.previousDistributionIdMarker = this.distributionData[0].id;
    }

    if (this.requestData && this.requestData.length > 0) {
      this.previousRequestIdMarker = this.requestData[0].id;
    }

    if (this.swarm.status === 'ready') {
      this.timer = setInterval(async () => {
        await this.fetchUpdatedMetrics();
      }, 3500);
    }

    if (this.swarm.status === 'destroyed') {
      await this.fetchFinalMetrics();
    }

    this.formatData();

    this.loading = false;
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  onRepeatCompleted = (evt: any) => {
    this.router.navigate(['/dashboard']);
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

    if (data.distribution && data.distribution.length > 0) {
      const distributionReversed = data.distribution.reverse();
      distributionReversed.forEach(item => {
        this.distributionData.unshift(item);
      });
      this.previousDistributionIdMarker = this.distributionData[0].id;
    }

    if (data.requests && data.requests.length > 0) {
      const requestReversed = data.requests.reverse();
      requestReversed.forEach(item => {
        this.requestData.unshift(item);
      });
      this.previousRequestIdMarker = this.requestData[0].id;
    }

    this.formatData();
  }

  async onDeleteCompleted() {
    this.metrics.track('SWARM_DETAIL_DELETE', { id: this.id });
    this.swarm.status = Status.destroyed;
    clearInterval(this.timer);
    await this.fetchFinalMetrics();
  }

  formatData() {
    // Take the distribution data and the request data and put into format.
    this.formattedResultData = [
      {
        name: 'Requests / second',
        series: this.requestData.slice().reverse().map(r => {
          return {
            value: r.requests_per_second,
            name: new Date(r.created_at)
          };
        })
      },
      {
        name: 'Failures / second',
        series: this.requestData.slice().reverse().map(r => {
          return {
            value: r.failures_per_second,
            name: new Date(r.created_at)
          };
        })
      }
    ];

    this.formattedFailureData = [{
      name: 'Failures',
      series: this.requestData.slice().reverse().map(r => {
        return {
          value: r.failures,
          name: new Date(r.created_at)
        };
      })
    }];

    if (this.distributionData.length > 0 && this.distributionData[0].percentiles['50%'] !== 'N/A') {
      this.formattedDistributionData = [
        { name: '50%', value: this.distributionData[0].percentiles['50%'] },
        { name: '66%', value: this.distributionData[0].percentiles['66%'] },
        { name: '75%', value: this.distributionData[0].percentiles['75%'] },
        { name: '80%', value: this.distributionData[0].percentiles['80%'] },
        { name: '90%', value: this.distributionData[0].percentiles['90%'] },
        { name: '95%', value: this.distributionData[0].percentiles['95%'] },
        { name: '98%', value: this.distributionData[0].percentiles['98%'] },
        { name: '99%', value: this.distributionData[0].percentiles['99%'] },
        { name: '100%', value: this.distributionData[0].percentiles['100%'] }
      ];
    }
  }

  getDataStart(): moment.Moment {
    if (this.requestData && Array.isArray(this.requestData) && this.requestData.length > 0) {
      for (let i = this.requestData.length - 1; i > 0; i--) {
        if (this.requestData[i].created_at) {
          return moment(this.requestData[i].created_at);
        }
      }
      return null;
    } else {
      return null;
    }
  }

  getCurrentUsers(): number {
    const start: moment.Moment = this.getDataStart();
    if (start) {
      const now: moment.Moment = moment();
      const duration: moment.Duration = moment.duration(now.diff(start));
      const seconds: number = duration.asSeconds();
      const currentUsers = Math.floor(seconds * this.swarm.spawn_rate);
      return currentUsers <= this.swarm.simulated_users ? currentUsers : this.swarm.simulated_users;
    } else {
      return 0;
    }
  }

  getFormattedRegions(regions: string): string {
    return this.swarmService.getFormattedRegion(regions);
  }
}
