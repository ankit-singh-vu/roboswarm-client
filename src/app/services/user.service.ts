import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions } from './http.service';

export interface User {
  id?: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  stripe_id?: string;
  stripe_plan_id: string;
  stripe_plan_description: string;
  created_at?: Date;
  group?: Group;
}

export interface Group {
  id?: number;
  name: string;
}

@Injectable()
export class UserService {

  constructor(private http: HttpService) { }

  async getCurrentUser(): Promise<User> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/user/me'
    };
    const result = await this.http.request(options);
    return result.data as User;
  }

  async selectPlan(planName: string): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/user/me/plan',
      data: { planName }
    };
    await this.http.request(options);
  }
}
