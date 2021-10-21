import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, 
  HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { WEATHER_APIKEY } from '../../../environments/environment' ;

@Injectable({
  providedIn: 'root'
})
export class ApiService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    req = req.clone({ setParams:{  
        APPID: WEATHER_APIKEY
      } 
    });
    console.warn('interceptor: ', JSON.stringify(req));
   return next.handle(req);
  }
  constructor() { }
}
