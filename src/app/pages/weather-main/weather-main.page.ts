import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { GoogleMap, GoogleMaps, GoogleMapsAnimation, Marker, MyLocation } from '@ionic-native/google-maps';

@Component({
  selector: 'app-weather-main',
  templateUrl: './weather-main.page.html',
  styleUrls: ['./weather-main.page.scss'],
})
export class WeatherMainPage implements OnInit {
  map: GoogleMap;
  address: string;
  currentLat: number;
  currentLong: number;

  constructor(private userService: UserService,
    private platform: Platform) { 
      this.userService.initializeDatabase();
    }

  ngOnInit() {
    this.platform.ready().then(() => this.loadMap());
  }
  
  loadMap(){
    this.map = GoogleMaps.create('map', {

    });
    this.GoToCurrentLocation();
  }

  GoToCurrentLocation(){
    this.map.getMyLocation().then((location: MyLocation) => {
      this.currentLat = location.latLng.lat;
      this.currentLong = location.latLng.lng;
      
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
    }).catch(e => alert(e.error_message));
  }

}
