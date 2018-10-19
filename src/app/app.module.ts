import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';

// Authored Services
import { HttpService } from './services/http.service';
import { TokenService } from './services/token.service';
import { SwarmMetricsService } from './services/swarm-metrics.service';
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
    LocustWebUiComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    HttpService,
    TokenService,
    SwarmService,
    SwarmMetricsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _tokenService: TokenService) {
    console.log('launching app...');
  }
}
