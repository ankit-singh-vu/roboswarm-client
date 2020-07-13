import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';

// Authored Services
import { HttpService } from './services/http.service';
import { MetricsService } from './services/metrics.service';
import { TokenService } from './services/token.service';
import { SiteOwnershipService } from './services/site-ownership.service';
import { SwarmService } from './services/swarm.service';
import { TemplateService } from './services/template.service';

// Authored Components
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NavigationLinksComponent } from './components/navigation-links/navigation-links.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SwarmTileComponent } from './components/swarm-tile/swarm-tile.component';
import { LoginComponent } from './pages/login/login.component';
import { SwarmCreateComponent } from './pages/swarm-create/swarm-create.component';
import { StopLoadTestButtonComponent } from './components/stop-load-test-button/stop-load-test-button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SwarmDetailComponent } from './pages/swarm-detail/swarm-detail.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { BillingComponent } from './pages/billing/billing.component';
import { UserService } from './services/user.service';
import { RepeatLoadTestComponent } from './components/repeat-load-test/repeat-load-test.component';
import { SiteOwnershipVerificationComponent } from './pages/site-ownership-verification/site-ownership-verification.component';
import { SiteOwnershipVerificationAddComponent } from './pages/site-ownership-verification-add/site-ownership-verification-add.component';
import { VerifySiteOwnershipButtonComponent } from './components/verify-site-ownership-button/verify-site-ownership-button.component';
import { DeleteLoadTestComponent } from './components/delete-load-test/delete-load-test.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplatesComponent } from './pages/templates/templates.component';
import { TemplatesAddEditComponent } from './pages/templates-add-edit/templates-add-edit.component';
import { WordpressRouteComponent } from './components/wordpress-route/wordpress-route.component';
import { SwarmDetailStatusComponent } from './components/swarm-detail-status/swarm-detail-status.component';
import { PaymentStatusBannerComponent } from './components/payment-status-banner/payment-status-banner.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    DashboardComponent,
    NavigationComponent,
    NavigationLinksComponent,
    PageHeaderComponent,
    FooterComponent,
    SwarmTileComponent,
    LoginComponent,
    SwarmCreateComponent,
    StopLoadTestButtonComponent,
    SpinnerComponent,
    SwarmDetailComponent,
    LogoutComponent,
    BillingComponent,
    RepeatLoadTestComponent,
    SiteOwnershipVerificationComponent,
    SiteOwnershipVerificationAddComponent,
    VerifySiteOwnershipButtonComponent,
    DeleteLoadTestComponent,
    TemplatesComponent,
    TemplatesAddEditComponent,
    WordpressRouteComponent,
    SwarmDetailStatusComponent,
    PaymentStatusBannerComponent
  ],
  imports: [
    BrowserModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [
    HttpService,
    MetricsService,
    TokenService,
    SiteOwnershipService,
    SwarmService,
    TemplateService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _tokenService: TokenService) {
    console.log('Launching Roboswarm...');
  }
}
