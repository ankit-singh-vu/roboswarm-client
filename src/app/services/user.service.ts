import { EventEmitter, Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions, RequestResult } from './http.service';

export interface User {
  id?: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  stripe_id?: string;
  stripe_plan_id?: string;
  stripe_plan_description?: string;
  stripe_card_id?: string;
  is_delinquent: boolean;
  created_at?: Date;
  group?: Group;
}

export interface Invoice {
  id: string;
  created: number;
  attempt_count: number;
  customer: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  paid: boolean;
  status: string;
}

export interface Group {
  id?: number;
  name: string;
}

export interface ResourceAvailability {
  resetsOnDate: Date;
  delinquent: boolean;
  loadTests: number;
  machineSeconds: number;
  maxDurationMinutes: number;
  maxLoadTests: number;
  maxMachineSeconds: number;
}

@Injectable()
export class UserService {
  public userChanged: EventEmitter<string> = new EventEmitter<string>();

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

  async selectPlan(planName: string): Promise<RequestResult> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/user/me/plan',
      data: { planName }
    };
    return await this.http.request(options);
  }

  async updateCard(token: string, cardId: string): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/user/me/card',
      data: { token, cardId }
    };
    await this.http.request(options);
  }

  async deleteCard(): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'DELETE',
      url: '/api/v1/user/me/card'
    };
    await this.http.request(options);
  }

  async getInvoices(): Promise<Invoice[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/user/me/invoices'
    };
    const result = await this.http.request(options);
    return result.data.data as Invoice[];
  }

  async payInvoice(id: string): Promise<Invoice> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: `/api/v1/user/me/invoices/${id}/pay`
    };
    const result = await this.http.request(options);
    if (result && result.data && result.data) {
      return result.data.data as Invoice;
    } else {
      return undefined;
    }
  }

  async resetPassword(email: string): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: false,
      requestType: 'POST',
      url: '/api/v1/public/user/password-reset',
      data: { email }
    };
    await this.http.request(options);
  }

  async changePassword(nonce: string, password: string): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: false,
      requestType: 'POST',
      url: `/api/v1/public/user/password-reset/${nonce}`,
      data: { password }
    };
    await this.http.request(options);
  }

  async getResources(): Promise<ResourceAvailability> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/user/me/resources'
    };
    const response = await this.http.request(options);
    return response.data as ResourceAvailability;
  }
}
