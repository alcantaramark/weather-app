import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private subject = new Subject<any>();
  constructor() { }

  publish(data: any){
    this.subject.next(data);
  }

  getObservable(): Subject<any>{
    return this.subject;
  }
}
