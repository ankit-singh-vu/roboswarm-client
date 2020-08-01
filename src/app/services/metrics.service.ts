import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mixpanel from 'mixpanel-browser';


@Injectable()
export class MetricsService {

  constructor() {
    if (environment.production) {
      mixpanel.init('a3a9a4c8718f193ce6beb4f50d2a8c0a');
    }
  }

  identifyUser(email: string): void {
    if (environment.production) {
      mixpanel.identify(email);
    } else {
      console.log('Metrics Development Fake User Identification: ', email);
    }
  }

  track(event: string, data?: Object): void {
    if (environment.production) {
      try {
        if (data) {
          mixpanel.track(event, data);
        } else {
          mixpanel.track(event);
        }
      } catch (err) {
        console.log('Error tracking event: ', err);
      }
    } else {
      console.log('Metrics Development Fake Tracking: ', { event, data });
    }
  }

}
