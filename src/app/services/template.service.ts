import { Injectable } from '@angular/core';
import { HttpService, HttpRequestOptions} from './http.service';

export interface TemplateAuth {
  username: string;
  password: string;
}

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
  is_woo_commerce?: boolean;
}

export interface WooCommerceTemplate {
  id?: number;
  created_at?: Date;
  group_id: Number;
  user_id: Number;
  name: string;
  description: string;
  shop_url: string;
  cart_url: string;
  checkout_url: string;
  product_a_url: string;
  product_b_url: string;
}

export interface AddUpdateWooCommerceTemplate {
  id?: number;
  name: string;
  description?: string;
  shop_url: string;
  cart_url: string;
  checkout_url: string;
  product_a_url: string;
  product_b_url: string;
}

export enum WordPressRouteType {
  AUTHENTICATED_FRONTEND_NAVIGATE,
  AUTHENTICATED_ADMIN_NAVIGATE,
  UNAUTHENTICATED_FRONTEND_NAVIGATE
}

export enum RouteMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
};

export interface AdvancedTemplateRoute {
  id: string;
  method: RouteMethod;
  path: string;
  headers?: {
    key: string;
    value: string;
  }[];
  queryParams?: {
    key: string;
    value: string;
  }[];
  body?: any;
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

  async requestWooCommerceTemplate(): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/template/woo-commerce'
    };
    await this.http.request(options);
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

  async createWooTemplate(data: AddUpdateWooCommerceTemplate): Promise<WooCommerceTemplate> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'POST',
      url: '/api/v1/template/woo-commerce',
      data
    };
    const result = await this.http.request(options);
    return result.data as WooCommerceTemplate;
  }

  async updateWooTemplate(id: number, data: AddUpdateWooCommerceTemplate): Promise<WooCommerceTemplate> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'PUT',
      url: `/api/v1/template/woo-commerce/${id}`,
      data
    };
    const result = await this.http.request(options);
    return result.data as WooCommerceTemplate;
  }

  async getWooTemplate(id: number): Promise<WooCommerceTemplate> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'GET',
      url: `/api/v1/template/woo-commerce/${id}`
    };
    const result = await this.http.request(options);
    return result.data as WooCommerceTemplate;
  }

  async deleteWooTemplate(id: number): Promise<void> {
    const options: HttpRequestOptions = {
      authenticated: true,
      requestType: 'DELETE',
      url: `/api/v1/template/woo-commerce/${id}`
    };
    await this.http.request(options);
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

  async uploadAuthFile(data: FormData): Promise<TemplateAuth[]> {
    const options: HttpRequestOptions = {
      authenticated: true,
      data,
      requestType: 'POST',
      url: '/api/v1/template/auth-file-upload'
    };
    const result = await this.http.request(options);
    return result.data as TemplateAuth[];
  }
}
