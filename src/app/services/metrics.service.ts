import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class MetricsService {

  constructor() { }

  track(event: string, data?: Object): void {
    if (environment.production) {
      console.log({ event, data });
      // try {
      //   if (!data) {
      //     amplitude.getInstance().logEvent(event);
      //   } else {
      //     amplitude.getInstance().logEvent(event, data);
      //   }
      // } catch (err) {
      //   console.log('Error tracking event: ', err);
      // }
    } else {
      console.log('Metrics Development Fake Tracking: ', { event, data });
    }
  }

}
