import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeatherMainPageRoutingModule } from './weather-main-routing.module';

import { WeatherMainPage } from './weather-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeatherMainPageRoutingModule
  ],
  declarations: [WeatherMainPage]
})
export class WeatherMainPageModule {}
