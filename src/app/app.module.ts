import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SQLite } from '@ionic-native/sqlite/ngx';
import { ApiService } from './services/interceptors/api.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    HttpClientModule, 
    IonicModule.forRoot(), 
    AppRoutingModule],
  providers: [
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  , SQLite
  , HTTP
  ,{ 
    provide: HTTP_INTERCEPTORS, 
    useClass: ApiService, 
    multi: true 
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
