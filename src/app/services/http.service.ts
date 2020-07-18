import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

interface AngularHttpOptions {
  headers?: HttpHeaders | {[header: string]: string | string[]};
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams|{[param: string]: string | string[]};
  reportProgress?: boolean;
  responseType?: 'arraybuffer'|'blob'|'json'|'text';
  withCredentials?: boolean;
}

export interface HttpRequestOptions {
  authenticated: boolean;
  data?: any;
  requestType: string;
  url: string;
}

export interface RequestResult {
  err?: any;
  data?: any;
  statusCode: number;
}

@Injectable()
export class HttpService {
  constructor(private _tokenService: TokenService,
              private _http: HttpClient) {
  }

  request(requestOptions: HttpRequestOptions): Promise<RequestResult> {
    const requestUrl = `${environment.serverUrl}${requestOptions.url}`;
    const method: string = requestOptions.requestType;
    const options: AngularHttpOptions = {
      observe: 'response'
    };

    // Add auth headers if required.
    if (requestOptions.authenticated) {
      options['headers'] =  {
        Authorization: `Bearer ${this._tokenService.jwt}`
      };
    }

    // Add query params if required.
    if (requestOptions.requestType === 'GET') {
      if (requestOptions.data) {
        options['params'] = requestOptions.data;
      }
    }

    return this.makeRequest(requestUrl, method, requestOptions.data, options);
  }

  private async makeRequest(url: string, method: string, body: any, options: AngularHttpOptions): Promise<RequestResult> {
    try {
      let req: any;
      switch (method) {
        case 'GET':
          req = this._http.get(url, options as any);
          break;
        case 'POST':
          req = this._http.post(url, body, options as any);
          break;
        case 'PUT':
          req = this._http.put(url, body, options as any);
          break;
        case 'PATCH':
          req = this._http.patch(url, body, options as any);
          break;
        case 'DELETE':
          req = this._http.delete(url, options as any);
          break;
      }
      const result = await req.toPromise();
      return {
        data: result.body,
        statusCode: result.status
      };
    } catch (err) {
      return {
        data: err.error,
        err,
        statusCode: err.status
      };
    }
  }
}
