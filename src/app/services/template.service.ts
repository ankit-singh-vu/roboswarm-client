import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions} from './http.service';

export interface TemplateRoute {
  id?: number;
  created_at?: Date;
  method: string;
  path: string;
}

export interface WordPressRoute {
  routeType: WordPressRouteType;
  routes: TemplateRoute[];
  sitemapUrl?: string;
}

export interface TemplateComplex {
  id?: number;
  group_id?: Number;
  user_id?: Number;
  created_at?: Date;
  name: string;
  site_url?: string;
  username?: string;
  password?: string;
  scenario_names?: string;
  routes: WordPressRoute[];
}

export interface TemplateSimple {
  id: number;
  name: string;
  created_at: Date;
}

export interface WooCommerceTemplate {
  id?: number;
  created_at?: Date;
  group_id: Number;
  user_id: Number;
  name: string;
  file_path: string;
  description: string;
}

export enum WordPressRouteType {
  AUTHENTICATED_FRONTEND_NAVIGATE,
  AUTHENTICATED_ADMIN_NAVIGATE,
  UNAUTHENTICATED_FRONTEND_NAVIGATE
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpService) { }

  async get(id: number): Promise<TemplateComplex> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/template/${id}`
    };
    const result = await this.http.request(options);
    return result.data as TemplateComplex;
  }

  async getAll(): Promise<TemplateSimple[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/template'
    };
    const result = await this.http.request(options);
    return result.data as TemplateSimple[];
  }

  async getAllWooCommerce(): Promise<WooCommerceTemplate[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/template/woo-commerce'
    };
    const result = await this.http.request(options);
    return result.data as WooCommerceTemplate[];
  }

  async create(data: TemplateComplex): Promise<TemplateComplex> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/template',
      data
    };
    const result = await this.http.request(options);
    return result.data as TemplateComplex;
  }

  async delete(id: number): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'DELETE',
      url: `/api/v1/template/${id}`
    };
    await this.http.request(options);
  }

  async update(id: number, data: TemplateComplex): Promise<TemplateComplex> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'PUT',
      url: `/api/v1/template/${id}`,
      data
    };
    const result = await this.http.request(options);
    return result.data as TemplateComplex;
  }

  async getSitemap(url: string): Promise<TemplateRoute[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/template/sitemap',
      data: { url }
    };
    const result = await this.http.request(options);
    return result.data as TemplateRoute[];
  }

  getWordPressRouteTypeName(routeType: WordPressRouteType): string {
    switch (routeType) {
      case WordPressRouteType.AUTHENTICATED_ADMIN_NAVIGATE:
        return 'Authenticated Admin Navigation';
      case WordPressRouteType.AUTHENTICATED_FRONTEND_NAVIGATE:
        return 'Authenticated Frontend Navigation';
      case WordPressRouteType.UNAUTHENTICATED_FRONTEND_NAVIGATE:
        return 'Unauthenticated Frontend Navigation';
      default:
        return '';
    }
  }
}
