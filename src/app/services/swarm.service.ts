import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions, RequestResult } from './http.service';

export enum Status {
  destroyed = 'destroyed',
  new = 'new',
  ready = 'ready',
  building = 'building',
  active = 'active'
}

export interface Machine {
  id: number;
  external_id?: number;
  ip_address?: string;
  created_at: Date;
  ready_at?: Date;
  destroyed_at?: Date;
  setup_complete: boolean;
  file_transfer_complete: boolean;
  is_master: boolean;
  dependency_install_complete: boolean;
  port_open_complete: boolean;
}

export interface NewMachine {
  region: string;
}

export interface Swarm {
  id: number;
  name: string;
  status: Status;
  group_id: number;
  user_id: number;
  simulated_users: number;
  ssh_key_id: number;
  file_path: string;
  host_url: string;
  spawn_rate: number;
  created_at: Date;
  ready_at: Date;
  destroyed_at: Date;
  region: string;
  duration: number;
  setup_complete: boolean;
  file_transfer_complete: boolean;
  swarm_ui_type: string;
  master_ip?: string;
  size?: number;
  template_id?: string;
  is_woo_template?: boolean;
}

export interface NewSwarm {
  name: string;
  duration: number;
  simulated_users: number;
  file_path: string;
  host_url?: string;
  site_id?: number;
  template_id?: number;
  spawn_rate: number;
  machines: Array<NewMachine>;
  region: string;
  swarm_ui_type: string;
  generate_test_from_template?: boolean;
  is_woo_commerce_template: boolean;
  is_advanced_route_template?: boolean;
  user_traffic_behavior?: string;
}

export interface Request {
  id?: number;
  swarm_id: number;
  created_at: Date;
  user_count?: number;
  requests: number;
  failures: number;
  median_response_time: number;
  average_response_time: number;
  min_response_time: number;
  max_response_time: number;
  avg_content_size: number;
  requests_per_second: number;
  failures_per_second?: number;
  avg_request_per_sec: number;
  avg_failure_per_sec: number;
  avg_response_time_window: number;
  med_response_time_window: number;
}

export interface Distribution {
  id?: number;
  swarm_id: number;
  created_at: Date;
  requests: number;
  percentiles: string;
  percentilesObject?: Object;
}

export interface LoadTestRouteSpecificData {
  id: number;
  created_at?: Date;
  swarm_id: number;
  method: string;
  route: string;
  requests: number;
  failures: number;
  median_response_time: number;
  average_response_time: number;
  min_response_time: number;
  max_response_time: number;
  avg_content_size: number;
  requests_per_second: number;
  failures_per_second: number;
  user_count: number;
  "50_percent": number;
  "66_percent": number;
  "75_percent": number;
  "80_percent": number;
  "90_percent": number;
  "95_percent": number;
  "98_percent": number;
  "99_percent": number;
  "100_percent": number;
}

export interface LoadTestMetrics {
  requests: Request[];
  distribution: Distribution[];
  errors: LoadTestError[];
}

export interface RequestFinal extends Request {
  method: string;
  route: string;
}

export interface DistributionFinal extends Distribution {
  method: string;
  route: string;
}

export interface LoadTestMetricsFinal {
  requests: RequestFinal[];
  distribution: DistributionFinal[];
  errors: LoadTestError[];
}

export interface LoadTestError {
  swarm_id: number;
  method: string;
  path: string;
  message: string;
  error_count: number;
  created_at?: Date;
}

export interface GetPageResult {
  swarms: Swarm[];
  totalSize: number;
}

export interface TimeRemainingResult extends RequestResult {
  data?: {
    timeInSeconds: number;
  }
}

@Injectable()
export class SwarmService {

  constructor(private http: HttpService) { }

  async createSwarm(swarm: NewSwarm): Promise<RequestResult> {
    const options: HttpRequestOptions = {
      authenticated: true,
      data: swarm,
      requestType: 'POST',
      url: '/api/v1/swarm'
    };
    return await this.http.request(options);
  }

  async getById(id: number): Promise<Swarm> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/swarm/${id}`
    };
    const result = await this.http.request(options);
    return result.data as Swarm;
  }

  async destroy(id: number): Promise<void> {
    const options: HttpRequestOptions = {
        authenticated: true,
        requestType: 'DELETE',
        url: `/api/v1/swarm/${id}`
    };
    await this.http.request(options);
  }

  async getPage(page: number = 1): Promise<GetPageResult> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/swarm?page=${page}`
    };
    const results = await this.http.request(options);
    return {
      swarms: results.data as Swarm[],
      totalSize: Number(results.headers.get('X-TOTAL-SWARMS'))
    };
  }

  async getMetrics(swarmId: number, lastDistributionId?: number, lastRequestId?: number): Promise<LoadTestMetrics> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: `/api/v1/swarm/${swarmId}/metrics`,
      data: {
        lastDistributionId,
        lastRequestId
      }
    };
    const results = await this.http.request(options);
    return results.data as LoadTestMetrics;
  }

  async getRouteSpecificMetrics(swarmId: number, route: string, lastRowId?: number): Promise<LoadTestRouteSpecificData[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: `/api/v1/swarm/${swarmId}/metrics/route-specific`,
      data: {
        route,
        lastRowId,
      }
    };
    const results = await this.http.request(options);
    return results.data as LoadTestRouteSpecificData[];
  }

  async getMetricsFinal(swarmId: number): Promise<LoadTestMetricsFinal> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/swarm/${swarmId}/metrics/final`
    };
    const results = await this.http.request(options);
    return results.data as LoadTestMetricsFinal;
  }

  async repeat(swarmId: number): Promise<Swarm> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: `/api/v1/swarm/${swarmId}/repeat`
    };
    const results = await this.http.request(options);
    return results.data as Swarm;
  }

  async deleteLoadTest(swarmId: number): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'DELETE',
      url: `/api/v1/swarm/${swarmId}/soft-delete`
    };
    await this.http.request(options);
  }

  async getTimeRemaining(swarmId: number): Promise<number> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/swarm/${swarmId}/time-remaining`
    };
    const result: TimeRemainingResult = await this.http.request(options);
    return result.data.timeInSeconds;
  }

  async getRoutes(swarmId: number): Promise<string[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/swarm/${swarmId}/routes`
    };
    const result = await this.http.request(options);
    return result.data as string[];
  }

  getFormattedRegion(regions: string): string {
    return regions
      .split(',')
      .map(region => {
        switch (region) {
          case 'sfo3':
            return 'San Francisco';
          case 'ams3':
            return 'Amsterdam';
          case 'blr1':
            return 'Bangalore';
          case 'fra1':
            return 'Frankfurt';
          case 'lon1':
            return 'London';
          case 'nyc3':
            return 'New York City';
          case 'sgp1':
            return 'Singapore';
          case 'syd1':
            return 'Sydney';
          case 'tor1':
            return 'Toronto';
        }
      })
      .join(', ');
  }
}
