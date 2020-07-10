import { Component } from '@angular/core';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: string = moment().format('YYYY');
  logoPath = `${environment.assetBase}/assets/images/logo.png`;
  constructor() {}
}
