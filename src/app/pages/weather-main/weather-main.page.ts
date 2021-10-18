import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-weather-main',
  templateUrl: './weather-main.page.html',
  styleUrls: ['./weather-main.page.scss'],
})
export class WeatherMainPage implements OnInit {

  constructor(private userService: UserService,
    private platform: Platform) { 
      this.userService.initializeDatabase();
    }

  ngOnInit() {
    
  }
  
}
