import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class TokenService {
  public jwt: string;
  private localStorageKey = 'roboswarmtoken';

  constructor(private router: Router) {
    this.jwt = this.getToken();
  }

  public clear() {
    this.jwt = '';
    window.localStorage.removeItem(this.localStorageKey);
  }

  private getToken(): string {
    const token: string = window.localStorage.getItem(this.localStorageKey);
    return (token) ? token : null;
  }

  public saveToken(token: string): void {
    window.localStorage.setItem(this.localStorageKey, token);
    this.jwt = this.getToken();
  }
}
