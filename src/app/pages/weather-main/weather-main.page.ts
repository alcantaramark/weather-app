import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { GoogleMap, GoogleMaps, GoogleMapsAnimation, Marker, MyLocation } from '@ionic-native/google-maps';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { WEATHER_IMG_URL } from '../../../environments/environment';


@Component({
  selector: 'app-weather-main',
  templateUrl: './weather-main.page.html',
  styleUrls: ['./weather-main.page.scss'],
})
export class WeatherMainPage implements OnInit {
  map: GoogleMap;
  address: string;
  currentWeather: string;
  currentCity: string;
  imgUrl: string;
  currentTemperature: number;
  dateToday:Date = new Date();

  constructor(private userService: UserService,
    private platform: Platform,
    private weatherService: WeatherService) { 
     
    }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => this.initApp());
  }
  
  initApp(){
    this.loadMap().then(res => this.loadWeather(res.lat, res.lon));
  }

  loadMap(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.map = GoogleMaps.create('map', {});

      this.map.getMyLocation().then((location: MyLocation) => {
        location.latLng.lat = 14.573694;
        location.latLng.lng = 121.049143;
  
        this.map.animateCamera({
          target: location.latLng,
          zoom: 17,
          duration: 5000,
        });
  
        let marker: Marker = this.map.addMarkerSync({
          position: location.latLng,
          title: 'You are here',
          animation: GoogleMapsAnimation.BOUNCE
        });
  
        marker.showInfoWindow();
        resolve({lat: location.latLng.lat, lon: location.latLng.lng });
      }).catch(e => reject(e.error_message));
    });
  }

  GoToCurrentLocation(){
    
  }

  loadWeather(lat: number, lon: number){
    //getWeather
    this.weatherService.getCurrentWeather(lat, lon).subscribe(res => {
      this.currentWeather = res.weather[0].description;
      this.currentCity = res.name;
      this.imgUrl = WEATHER_IMG_URL + res.weather[0].icon + '@2x.png';
      this.currentTemperature = res.main.temp;
    });
  }

}
