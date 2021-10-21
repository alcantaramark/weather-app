import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WEATHER_API_URL } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getCurrentWeather(lat: number, lon: number): Observable<any>{
    let params = new HttpParams().set('lat', lat).set('lon', lon).set('units', 'metric');
    return this.http.get( WEATHER_API_URL, { params: params }).pipe(
      catchError(e => { throw 'error in service: ' + JSON.stringify(e) })
    );
  }
}
