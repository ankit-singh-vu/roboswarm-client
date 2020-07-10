import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  logoPath = `${environment.assetBase}/assets/images/logo.png`;

  constructor() { }

  ngOnInit() {
  }

}
