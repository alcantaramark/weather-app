import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeatherMainPage } from './weather-main.page';

const routes: Routes = [
  {
    path: '',
    component: WeatherMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherMainPageRoutingModule {}
