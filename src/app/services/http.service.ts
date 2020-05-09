import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import axios, { AxiosRequestConfig, Method } from 'axios';

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
  private tokenService: TokenService;

  constructor(private _tokenService: TokenService) {
    this.tokenService = _tokenService;
  }

  request(requestOptions: HttpRequestOptions): Promise<RequestResult> {
    const options: AxiosRequestConfig = {
      url: `${environment.serverUrl}${requestOptions.url}`,
      method: requestOptions.requestType as Method
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
        options['params'] = requestOptions.data;
      }
    }

    // Add post/put/patch data if required.
    if (['POST', 'PUT', 'PATCH'].includes(requestOptions.requestType)) {
      if (requestOptions.data) {
        options['data'] = requestOptions.data;
      }
    }

    return this.makeRequest(options);
  }

  private async makeRequest(options: AxiosRequestConfig): Promise<RequestResult> {
    try {
      const result = await axios.request(options);
      return {
        data: result.data,
        statusCode: result.status
      };
    } catch (err) {
      return {
        err,
        statusCode: null
      };
    }
  }
}
