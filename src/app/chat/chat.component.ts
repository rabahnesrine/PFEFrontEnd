import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { UserServService } from '../Services/user-serv.service';
import { WebSocketServiceService } from '../web-socket-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  currentUser:String;
  users:User[];
  constructor(private authServ:AuthServService,private userServ:UserServService,public webSocketService: WebSocketServiceService) { 
    this.currentUser= this.authServ.getUserFromLocalCache().username;
    this.users=this.userServ.getUsersFromLocalCache();
  }

  ngOnInit(): void {
  }

  title = 'chat-angular';
  openChat: boolean = false;
  username: string;

  usernameSet(username: string){
    this.username = username;
    this.openChat = true;
  }


}
