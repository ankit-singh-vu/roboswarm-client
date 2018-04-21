import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';

// Components
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';

// Services
import { HttpService } from './services/http.service';
import { TokenService } from './services/token.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NavigationLinksComponent } from './components/navigation-links/navigation-links.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FooterComponent } from './components/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    DashboardComponent,
    NavigationComponent,
    NavigationLinksComponent,
    PageHeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    HttpService,
    TokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _tokenService: TokenService) {
    console.log('launching app...');
  }
}
