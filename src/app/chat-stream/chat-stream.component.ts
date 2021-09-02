import {Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ChatMessageDto } from '../models/ChatMessageDto';
import { WebSocketServiceService } from '../web-socket-service.service';

@Component({
  selector: 'app-chat-stream',
  templateUrl: './chat-stream.component.html',
  styleUrls: ['./chat-stream.component.css']
})
export class ChatStreamComponent implements OnInit {

  
  list: any;
  @ViewChild("message") message: ElementRef;
  @Input() username: string;
  
  constructor(private http: HttpClient, private messageService: WebSocketServiceService) {
    
  }
  sesList:ChatMessageDto[] = this.messageService.msg;
    input;
  ngOnInit(): void {
    this.getAllchat();
     this.messageService.initializeWebSocketConnection();
   }
  sendMessage() {
    if (this.input) {
      this.messageService.sendMessage(this.username, this.input, sessionStorage.getItem("room"));
      this.sesList.push(this.input);
    localStorage.setItem('liste Msg',JSON.stringify(this.sesList));
      console.log(this.sesList)
      this.input = '';
    }
  }
 

/*   getAllchat(){
    this.http.get('/msg/get/start').subscribe(data => this.list = data);
  }
 */

  public getAllchat(): void {
    this.messageService.getAllChat().subscribe(
      (response: ChatMessageDto[]) => {
console.log("affiche get msg")
        console.log(response);
        
       // this.sprints = response;
      }
    );
        
    
  }

}


