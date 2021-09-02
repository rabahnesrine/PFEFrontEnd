import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CalandrieServService {
  private host=environment.apiUrl;

  constructor(private http: HttpClient) { }
  getEvent(){
    return this.http.get(`${this.host}/user/listEvt`).pipe(map(res => {
    return res;
    }));
    ;
  }



  getTypeRequest(userid:number) {
    return this.http.get(`${this.host}/user/getEvent/${userid}`).pipe(map(res => {
    return res;
    }));
    ;
  }

  postTypeRequest(url, payload) {
  return this.http.post(`${this.host}${url}`, payload).pipe(map(res => {
  return res;
  }));
  }
  
  putTypeRequest(url, payload) {
  return this.http.put(`${this.host}${url}`, payload).pipe(map(res => {
  return res;
  }));
  }



}
