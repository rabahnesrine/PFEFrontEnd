import { Component, OnInit } from '@angular/core';

import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { UserServService } from '../Services/user-serv.service';
import { ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chatuser',
  templateUrl: './chatuser.component.html',
  styleUrls: ['./chatuser.component.css']
})
export class ChatuserComponent implements OnInit {

 
    currentUser:String;
    users:User[];
    constructor(private authServ:AuthServService,private userServ:UserServService) { 
      this.currentUser= this.authServ.getUserFromLocalCache().username;
      this.users=this.userServ.getUsersFromLocalCache();
    }
  
    ngOnInit(): void {
    }
  
   
  
    @ViewChild("username") username: ElementRef;
    @ViewChild("room") room: ElementRef;
  
    @Output() usernameSet = new EventEmitter<string>();
  
    setUsername(){
      if(this.username.nativeElement.value != "" || null || undefined){
        this.usernameSet.emit(this.username.nativeElement.value);
        sessionStorage.setItem("room", this.room.nativeElement.value);
      }
    }
  
  
  }


