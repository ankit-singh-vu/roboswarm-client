import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions} from './http.service';

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

export interface TemplateHydrated extends Template {
  routes: TemplateRoute[];
}

export interface WordPressRoute {
  routeType: WordPressRouteType;
  routes: TemplateRoute[];
  sitemapUrl?: string;
}

export interface TemplateComplex {
  id?: number;
  created_at?: Date;
  name: string;
  siteUrl?: string;
  username?: string;
  password?: string;
  routes: WordPressRoute[];
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

  async get(id: number): Promise<TemplateHydrated> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/template/${id}`
    };
    const result = await this.http.request(options);
    return result.data as TemplateHydrated;
  }

  async getAll(): Promise<Template[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: '/api/v1/template'
    };
    const result = await this.http.request(options);
    return result.data as Template[];
  }

  async create(data: TemplateComplex): Promise<Template> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/template',
      data
    };
    const result = await this.http.request(options);
    return result.data as Template;
  }

  async delete(id: number): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'DELETE',
      url: `/api/v1/template/${id}`
    };
    await this.http.request(options);
  }

  async update(id: number, data: TemplateComplex): Promise<TemplateHydrated> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'PUT',
      url: `/api/v1/template/${id}`,
      data
    };
    const result = await this.http.request(options);
    return result.data as TemplateHydrated;
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
