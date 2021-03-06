import { Component, OnInit } from '@angular/core';
import { Router, ɵangular_packages_router_router_b } from '@angular/router';
import { GlobalService } from './services/global/global.service';
import { UserService } from './services/user/user.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  public appPages = [
    { title: 'User Profile', url: 'edit-profile', icon: 'people-circle' },
    { title: 'Weather', url: 'weather-main', icon: 'cloud' }
  ];
  userId:Number;
  constructor( private userService: UserService,
    private globalService: GlobalService,
    private router: Router,
    private splashScreen: SplashScreen,
    private platform: Platform,
    private statusBar: StatusBar) {
  }
  
  ngOnInit(){
    this.platform.ready().then(() => {
      this.initApp();
    });
  }

  initApp(){
    //Initializing Database and Redirection logic
    this.splashScreen.hide();
    this.statusBar.styleDefault();
    this.globalService.getObservable().subscribe(data => this.userId = data.userId);
    this.userService.initializeDatabase().then(() => {
      this.userService.getUsers().then(res => {
        if(res.length > 0){
          this.userId = res[0].id;
          this.router.navigate(['weather-main']);
        }
        else
          this.router.navigate(['user-profile']);
      });
    });
  }
}
