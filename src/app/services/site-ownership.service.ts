import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions } from './http.service';

export interface SiteOwnership {
  id?: number;
  group_id?: number;
  user_id?: number;
  base_url: string;
  uuid?: string;
  verified?: boolean;
  created_at?: Date;
}

@Injectable()
export class SiteOwnershipService {

  constructor(private http: HttpService) { }

  async create(newSite: SiteOwnership): Promise<SiteOwnership> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/site-ownership',
      data: newSite
    };
    const result = await this.http.request(options);
    return result.data as SiteOwnership;
  }

  async getAll(): Promise<SiteOwnership[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/site-ownership'
    };
    const result = await this.http.request(options);
    return result.data as SiteOwnership[];
  }

  async verify(id: number): Promise<SiteOwnership> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: `/api/v1/site-ownership/verify/${id}`
    };
    const result = await this.http.request(options);
    return result.data as SiteOwnership;
  }

}
