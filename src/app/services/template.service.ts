import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions, RequestResult } from './http.service';

export interface Template {
  id?: number;
  created_at?: Date;
  group_id?: Number;
  user_id?: Number;
  name: string;
}

export interface TemplateRoute {
  id?: number;
  created_at?: Date;
  load_test_template_id?: number;
  method: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpService) { }

  async getAll(): Promise<Template[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/template'
    };
    const result = await this.http.request(options);
    return result.data as Template[];
  }

  async create(name: string, routes: TemplateRoute[]): Promise<Template> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/template',
      data: {
        name,
        routes,
      }
    };
    const result = await this.http.request(options);
    return result.data as Template;
  }
}
