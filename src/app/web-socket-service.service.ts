import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChatMessageDto } from './models/ChatMessageDto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var SockJS;
declare var Stomp;


@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  private host=environment.apiUrl;


  webSocket: WebSocket;
  chatMessage: ChatMessageDto[] = [];
  public stompClient:any;
  public msg:ChatMessageDto[] = [];
  constructor(private http : HttpClient) {

  }
 
 public initializeWebSocketConnection() {
   console.log("test")
    const serverUrl = 'http://localhost:8080/socket';
  var ws = new SockJS(serverUrl);
   console.log(ws)
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe(sessionStorage.getItem("room"),message => {
        if (message.body) {
          that.msg.push(JSON.parse(message.body));
        }
      });
    });
  }

 

 

  sendMessage(name:string, message:string, room:string) {
   // console.log(message);
    const dto = new ChatMessageDto(null, name, message,null, room)
    console.log(dto);
    console.log(JSON.stringify(dto));
    //this.stompClient.send("/msg/sendMsg/chatRoom", {}, JSON.stringify(dto));

    return this.http.post(this.host+"/msg/sendMsg/chatRoom",dto)
  }

  public getAllChat():Observable<ChatMessageDto[]|HttpErrorResponse>{
    return this.http.get<ChatMessageDto[]> (`${this.host}/msg/get/start`);
  }

  

}
