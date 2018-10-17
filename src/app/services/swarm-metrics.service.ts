import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions } from './http.service';

@Injectable()
export class SwarmMetricsService {

  constructor(private http: HttpService) { }

  async getMetricsForSwarm(swarmId: number): Promise<any> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/swarm/${swarmId}/load-test-metrics`
    };
    const result = await this.http.request(options);
    return result.data;
  }

}
