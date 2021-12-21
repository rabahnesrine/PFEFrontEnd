import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventServService {
  private host=environment.apiUrl;


  constructor(private http : HttpClient) { }


  public getEventInvited(id:number):Observable<Event[]|HttpErrorResponse>{
    return this.http.get<Event[]|HttpErrorResponse>(`${this.host}/event/getEvent/${id}`)
  }

  public getEventCreated(id:number):Observable<Event[]|HttpErrorResponse>{
    return this.http.get<Event[]|HttpErrorResponse>(`${this.host}/event/eventCreateur/${id}`)
  }
  public getallEventNoArchive():Observable<Event[]|HttpErrorResponse>{
    return this.http.get<Event[]|HttpErrorResponse>(`${this.host}/event/getAllEvent`)
  }

  public getMyEventArchive(id:number):Observable<Event[]|HttpErrorResponse>{
    return this.http.get<Event[]|HttpErrorResponse>(`${this.host}/event/eventArchivebyCreateur/${id}`)
  }


  updateEvt(id:number, evt:Event) {
  
    return this.http.put(`${this.host}/event/evtEdit/`+ id , evt);
  }


  public allEvtArchive():Observable<Event[]|HttpErrorResponse> {
  
    return this.http.get<Event[]>(`${this.host}/event/archives`);
  }





  public addEvent(event:Event):Observable<Event|HttpErrorResponse>{
    return this.http.post<Event>(`${this.host}/event/addEvent`,event);
  }


  deleteEvent(id:number) {
    return this.http.delete(`${this.host}/event/deleteEvt/${id}`);
  }



  archiveEvt(id:number,evt:Event) {
 
    return this.http.put(`${this.host}/event/archive/` + id ,  evt);
  }
  restoreEvt(id:number,evt:Event) {
      
    return this.http.put(`${this.host}/event/restaurer/` +  id , evt );
  }



}
