import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  SwarmService,
  LoadTestMetrics,
  Request,
  Distribution,
  Swarm,
  Status,
  DistributionFinal,
  LoadTestError,
  RequestFinal,
  LoadTestMetricsFinal} from '../../services/swarm.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MetricsService } from '../../services/metrics.service';
import { SwarmGradeData } from '../../components/swarm-grade/swarm-grade.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-swarm-detail',
  templateUrl: './swarm-detail.component.html',
  styleUrls: ['./swarm-detail.component.css']
})
export class SwarmDetailComponent implements OnInit, OnDestroy {
  id: number;
  timer: NodeJS.Timeout;
  distributionData: Distribution[] = [];
  distributionDataFinal: DistributionFinal[] = [];
  requestData: Request[] = [];
  requestDataView: Request[] = [];
  requestDataFinal: RequestFinal[] = [];
  loadTestErrors: LoadTestError[] = [];
  swarm: Swarm;
  previousDistributionIdMarker = 0;
  previousRequestIdMarker = 0;
  formattedFailureData = [];
  formattedResultData = [];
  formattedDistributionData = [];
  formattedResponseTimeData = [];
  loading: boolean;
  editName: false;
  activeTabId: number;
  swarmGradeData: SwarmGradeData = null;
  timeRemaining: string;
  timeRemainingTimer: NodeJS.Timeout;
  userCount: number = null;

  // Request Chart
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Requests';
  view = [500, 300];
  requestColorScheme = {
    domain: [
      '#009cff', // blue
      '#ff8073'  // red
    ]
  };

  // Response Time Chart
  responseTimeYAxisLabel = 'Response Time (ms)';

  // Distribution Chart
  distributionXAxisLabel = '% of requests completed in N milliseconds';
  distributionYAxisLabel = 'Time in milliseconds';

  constructor(private swarmService: SwarmService,
              private route: ActivatedRoute,
              private router: Router,
              private metrics: MetricsService,
              private modalService: NgbModal) { }

  async ngOnInit() {
    this.loading = true;
    this.id = parseInt(this.route.snapshot.params.id, 10);
    this.swarm = await this.swarmService.getById(this.id);
    const initialData: LoadTestMetrics = await this.swarmService.getMetrics(this.id);
    this.distributionData = [...initialData.distribution].reverse();
    this.requestData = [...initialData.requests];
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

    if (this.swarm.status !== 'destroyed') {
      this.updateTimeRemaining();
      this.timeRemainingTimer = setInterval(() => {
        this.updateTimeRemaining();
      }, 1000);
    }

    this.loading = false;
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timeRemainingTimer);
  }

  updateTimeRemaining() {
    const startTime: moment.Moment = moment(this.swarm.ready_at);
    const endTime: moment.Moment = startTime.add(this.swarm.duration, 'minutes');
    const now: moment.Moment = moment();
    const duration: moment.Duration = moment.duration(endTime.diff(now));
    const hours = `${duration.get('hours')}`.padStart(2, '0');
    const minutes = `${duration.get('minutes')}`.padStart(2, '0');
    const seconds = `${duration.get('seconds')}`.padStart(2, '0');
    this.timeRemaining = `${hours}:${minutes}:${seconds}`;
  }

  onRepeatCompleted = (evt: any) => {
    this.router.navigate(['/dashboard']);
  }

  fetchFinalMetrics = async () => {
    const result: LoadTestMetricsFinal = await this.swarmService.getMetricsFinal(this.id);
    this.distributionDataFinal = result.distribution;
    this.requestDataFinal = result.requests.map(rdf => {
      return {
        ...rdf,
        method: rdf.method.replace('"', '').replace('"', ''),
        route: rdf.route.replace('"', '').replace('"', '')
      };
    });
    this.loadTestErrors = result.errors;
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
      const distributionReversed = [...data.distribution].reverse();
      distributionReversed.forEach(item => {
        const exists = this.distributionData.find(dd => dd.id === item.id);
        if (!exists) {
          this.distributionData.unshift(item);
        }
      });
      this.previousDistributionIdMarker = this.distributionData[0].id;
    }

    if (data.requests && data.requests.length > 0) {
      const requestReversed = [...data.requests].reverse();
      requestReversed.forEach(item => {
        const exists = this.requestData.find(rd => rd.id === item.id);
        if (!exists) {
          this.requestData.unshift(item);
        }
      });
      this.previousRequestIdMarker = this.requestData[0].id;
    }
    this.requestData = this.requestData.slice();

    this.loadTestErrors = data.errors;

    this.formatData();
  }

  hasErrors() {
    return this.loadTestErrors && this.loadTestErrors.length > 0;
  }

  async onDeleteCompleted() {
    this.metrics.track('SWARM_DETAIL_DELETE', { id: this.id });
    this.swarm.status = Status.destroyed;
    clearInterval(this.timer);
    await this.fetchFinalMetrics();
    this.formatData();
  }

  formatData() {
    // Take the distribution data and the request data and put into format.
    this.requestDataView = [...this.requestData].reverse();
    if (this.requestDataView && this.requestDataView.length > 0) {
      const count: number = this.requestDataView[this.requestDataView.length - 1].user_count;
      if (count) { this.userCount = count; }
    }

    this.formattedResultData = [
      {
        name: 'Requests / second',
        series: this.requestDataView.map(r => {
          return {
            value: r.requests_per_second,
            name: new Date(r.created_at)
          };
        })
      },
      {
        name: 'Failures / second',
        series: this.requestDataView.map(r => {
          return {
            value: r.failures_per_second,
            name: new Date(r.created_at)
          };
        })
      }
    ];

    this.formattedResponseTimeData = [
      {
        name: 'Response Time (Average)',
        series: this.requestDataView.map(r => {
          return {
            value: r.average_response_time,
            name: new Date(r.created_at)
          };
        })
      },
      {
        name: 'Response Time (Median)',
        series: this.requestDataView.map(r => {
          return {
            value: r.median_response_time,
            name: new Date(r.created_at)
          };
        })
      }
    ];

    this.formattedFailureData = [{
      name: 'Failures',
      series: this.requestDataView.map(r => {
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

    // Set the swarm grade if we've got enough data for it.
    const p50: number = (
      this.distributionData && this.distributionData.length > 0
    ) ? this.distributionData[0].percentiles['50%'] : null;
    const p99: number = (
      this.distributionData && this.distributionData.length > 0
    ) ? this.distributionData[0].percentiles['99%'] : null;
    if (this.requestDataView && this.requestDataView.length > 0) {
      const latest: Request = this.requestDataView.pop();
      this.swarmGradeData = {
        p50,
        p99,
        totalRequests: latest.requests,
        totalErrors: latest.failures,
        avgResponseTime: latest.average_response_time,
        medResponseTime: latest.median_response_time
      };
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

  getFormattedRegions(regions: string): string {
    return this.swarmService.getFormattedRegion(regions);
  }

  onSoftDelete() {
    this.router.navigate(['/dashboard']);
  }

  async openGradeDocs(content: any) {
    try {
      this.metrics.track('SWARM_DETAIL_OPEN_GRADE_DOCS');
      await this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg'
      });
    } catch (err) { /* no-op */ }
  }
}
