import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions, RequestResult } from './http.service';
import { TokenService } from './token.service';

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
}

export interface Request {
  id?: number;
  swarm_id: number;
  created_at: Date;
  requests: number;
  failures: number;
  median_response_time: number;
  average_response_time: number;
  min_response_time: number;
  max_response_time: number;
  avg_content_size: number;
  requests_per_second: number;
  failures_per_second?: number;
}

export interface Distribution {
  id?: number;
  swarm_id: number;
  created_at: Date;
  requests: number;
  percentiles: string;
  percentilesObject?: Object;
}

export interface LoadTestMetrics {
  requests: Request[];
  distribution: Distribution[];
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
}

@Injectable()
export class SwarmService {

  constructor(private http: HttpService,
              private token: TokenService) { }

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

  async getAll(): Promise<Swarm[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/swarm'
    };
    const results = await this.http.request(options);
    return results.data as Swarm[];
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

  getFormattedRegion(regions: string): string {
    return regions
      .split(',')
      .map(region => {
        switch (region) {
          case 'sfo2':
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
          case 'tor1':
            return 'Toronto';
        }
      })
      .join(', ');
  }
}
