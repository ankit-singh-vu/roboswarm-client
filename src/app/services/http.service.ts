import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import * as request from 'request';

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
  private http: Http;
  private tokenService: TokenService;

  constructor(private _http: Http,
              private _tokenService: TokenService) {
    this.http = _http;
    this.tokenService = _tokenService;
  }

  request(requestOptions: HttpRequestOptions): Promise<RequestResult> {
    const options = {
      uri: `${environment.serverUrl}${requestOptions.url}`,
      method: requestOptions.requestType,
      json: true
    };

    // Add auth headers if required.
    if (requestOptions.authenticated) {
      options['headers'] =  {
        Authorization: `Bearer ${this.tokenService.jwt}`
      };
    }

    // Add query params if required.
    if (requestOptions.requestType === 'GET') {
      if (requestOptions.data) {
        options['qa'] = requestOptions.data;
      }
    }

    // Add post/put/patch data if required.
    if (['POST', 'PUT', 'PATCH'].includes(requestOptions.requestType)) {
      if (requestOptions.data) {
        options['body'] = requestOptions.data;
      }
    }

    return this.makeRequest(options);
  }

  private makeRequest(options: any): Promise<RequestResult> {
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err) {
          resolve({
            data: body,
            statusCode: res.statusCode
          });
        } else {
          reject({
            err,
            statusCode: res.statusCode
          });
        }
      });
    });
  }
}
