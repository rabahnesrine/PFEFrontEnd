import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Msg } from '../models/Msg';

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  private host=environment.apiUrl;

  constructor(private http: HttpClient) { }


  
saveMsg(msg:Msg):Observable<Msg|HttpErrorResponse>{
  return this.http.post<Msg>(`${this.host}/msg/add`,msg);
   
}


getMsgSenderAndReciver(idSender:number,idReceiver:number):Observable<Msg[]|HttpErrorResponse> {
  return this.http.get<Msg[]>(`${this.host}/msg/findbySender/${idSender}/findbyReceiver/${idReceiver}`);
}


getMsgSendAndRec(idSender:number,idReceiver:number):Observable<Msg[]|HttpErrorResponse> {
  return this.http.get<Msg[]>(`${this.host}/msg/findbySend/${idSender}/findbyRece/${idReceiver}`);
}


public updateMsg(idMsg:number,msg:Msg):Observable<Msg|HttpErrorResponse>{
  return this.http.put<Msg>(`${this.host}/msg/updateVu/${idMsg}`,msg);
}


public addMsgsToLocalCache(msgs:Msg[]):void{
  localStorage.setItem('msgs',JSON.stringify(msgs));
}

public getMsgsFromLocalCache():Msg[]{
  if(localStorage.getItem('msgs')){
  return  JSON.parse( localStorage.getItem('msgs')); 
}
 return null ;
}

}
