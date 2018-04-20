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


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent
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
