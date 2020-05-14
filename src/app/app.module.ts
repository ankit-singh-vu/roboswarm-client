import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Authored Services
import { HttpService } from './services/http.service';
import { MetricsService } from './services/metrics.service';
import { TokenService } from './services/token.service';
import { SiteOwnershipService } from './services/site-ownership.service';
import { SwarmService } from './services/swarm.service';

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
import { LocustWebUiComponent } from './pages/locust-web-ui/locust-web-ui.component';
import { SwarmDetailComponent } from './pages/swarm-detail/swarm-detail.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { BillingComponent } from './pages/billing/billing.component';
import { UserService } from './services/user.service';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { RepeatLoadTestComponent } from './components/repeat-load-test/repeat-load-test.component';
import { SiteOwnershipVerificationComponent } from './pages/site-ownership-verification/site-ownership-verification.component';
import { SiteOwnershipVerificationAddComponent } from './pages/site-ownership-verification-add/site-ownership-verification-add.component';
import { VerifySiteOwnershipButtonComponent } from './components/verify-site-ownership-button/verify-site-ownership-button.component';
import { DeleteLoadTestComponent } from './components/delete-load-test/delete-load-test.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


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
    LocustWebUiComponent,
    SwarmDetailComponent,
    LogoutComponent,
    BillingComponent,
    DocumentationComponent,
    RepeatLoadTestComponent,
    SiteOwnershipVerificationComponent,
    SiteOwnershipVerificationAddComponent,
    VerifySiteOwnershipButtonComponent,
    DeleteLoadTestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    HttpService,
    MetricsService,
    TokenService,
    SiteOwnershipService,
    SwarmService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _tokenService: TokenService) {
    console.log('launching app...');
  }
}
