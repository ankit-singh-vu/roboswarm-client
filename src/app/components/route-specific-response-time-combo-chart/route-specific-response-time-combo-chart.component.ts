import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { color } from 'chart.js/helpers';
import { Request } from '../../services/swarm.service';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

interface FormattedDataAndLabels {
  avg_response_time: any[];
  med_response_time: any[];
  userCount: any[];
  labels: any[];
}

@Component({
  selector: 'app-route-specific-response-time-combo-chart',
  templateUrl: './route-specific-response-time-combo-chart.component.html',
  styleUrls: ['./route-specific-response-time-combo-chart.component.css']
})
export class RouteSpecificResponseTimeComboChartComponent implements OnInit, OnChanges {
  @Input() requests: Request[];

  private ctx: any;
  private requestComboChart: Chart;
  private initialized = false;

  constructor() { }

  ngOnInit(): void {
    let options: any = {};
    const datasets = [];
    const formattedData: FormattedDataAndLabels = this.getFormattedDataAndLabels();
    const blue = color('#588de2').alpha(0.5).rgbString();
    const red = color('#ff2626').alpha(0.5).rgbString();
    const green = color('#008000').alpha(0.2).rgbString();
    datasets.push({
      type: 'line',
      label: 'Avg Response Time (ms)',
      data: formattedData.avg_response_time,
      pointRadius: 2,
      borderColor: blue,
      backgroundColor: blue,
    });
    datasets.push({
      type: 'line',
      label: 'Med. Response Time (ms)',
      data: formattedData.med_response_time,
      pointRadius: 2,
      borderColor: red,
      backgroundColor: red,
    });
    datasets.push({
      type: 'bar',
      label: 'Total User Count',
      backgroundColor: green,
      data: formattedData.userCount
    });
    options = {
      type: 'line',
      data: {
        labels: formattedData.labels,
        datasets
      },
      steppedLine: true,
      options: {
        legend: {
          display: true,
        },
        tooltips: {
          enabled: true,
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            maxTicksLimit: 12,
            adapters: {
              date: {
                locale: enUS,
              },
            },
          },
          y: {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 12,
            },
          },
        },
      },
    };

    // Performance tweaks for large data sets.
    if (this.requests && this.requests.length > 250) {
      // options.elements = {
      //   line: {
      //     tension: 0, // disables bezier curves
      //   },
      // };
      // options.animation = {
      //   duration: 0,
      // };
      // options.hover = {
      //   animationDuration: 0,
      // };
      // options.responsiveAnimationDuration = 0;
    }

    this.ctx = document.getElementById('routeSpecificResponseTimeComboChart');
    this.requestComboChart = new Chart(this.ctx, options);
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized) {
      const data: FormattedDataAndLabels = this.getFormattedDataAndLabels();
      // Todo: need to memoize a hash for this data so we don't re-render
      // if things don't change.
      this.requestComboChart.data.labels = data.labels;
      this.requestComboChart.data.datasets[0].data = data.avg_response_time;
      this.requestComboChart.data.datasets[1].data = data.med_response_time;
      this.requestComboChart.data.datasets[2].data = data.userCount;
      this.requestComboChart.update();
    }
  }

  private getFormattedDataAndLabels(): FormattedDataAndLabels {
    const formattedData: FormattedDataAndLabels = {
      labels: [],
      avg_response_time: [],
      med_response_time: [],
      userCount: []
    };

    if (this.requests && this.requests.length > 0) {
      this.requests.sort((a: Request, b: Request) => {
        if (a.id < b.id) { return -1; }
        if (a.id > b.id) { return 1; }
        return 0;
      });
      this.requests.forEach(row => {
        formattedData.labels.push(new Date(row.created_at));
        formattedData.avg_response_time.push(row.average_response_time);
        formattedData.med_response_time.push(row.median_response_time);
        if (typeof row.user_count === 'number') {
          formattedData.userCount.push(row.user_count);
        }
      });
    }

    return formattedData;
  }

}
