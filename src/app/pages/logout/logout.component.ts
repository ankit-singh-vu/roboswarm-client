import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private tokenService: TokenService,
              private router: Router,
              private metrics: MetricsService) { }

  async ngOnInit() {
    this.metrics.track('LOGOUT');
    this.tokenService.clear();
    this.router.navigate(['/auth/login']);
  }

}
