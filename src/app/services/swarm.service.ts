import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions } from './http.service';
import { TokenService } from './token.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';

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
  host_url: string;
  spawn_rate: number;
  machines: Array<NewMachine>;
  region: string;
  swarm_ui_type: string;
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
              private rawHttp: Http,
              private token: TokenService) { }

  async createSwarm(fileUploadData: FormData, swarm: NewSwarm): Promise<Swarm> {
    const filePath = await this.uploadFile(fileUploadData);
    swarm.file_path = filePath;
    const options: HttpRequestOptions = {
      authenticated: true,
      data: swarm,
      requestType: 'POST',
      url: '/api/v1/swarm'
    };
    const response = await this.http.request(options);
    return response.data as Swarm;
  }

  async uploadFile(fileUploadData: FormData): Promise<string> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${this.token.jwt}`);
    const options = new RequestOptions({ headers: headers });
    const result: any = await this.rawHttp.post(`${environment.serverUrl}/api/v1/swarm/file-upload`, fileUploadData, options).toPromise();
    return JSON.parse(result._body).filePath;
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
}
