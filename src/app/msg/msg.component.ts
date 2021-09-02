import { Component, OnInit } from '@angular/core';
import { Msg } from '../models/Msg';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { MsgService } from '../Services/msg.service';
import { UserServService } from '../Services/user-serv.service';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.css']
})
export class MsgComponent implements OnInit {

  currentUser:String;
  users:User[];
  currentu:User;
  newMsg:Msg;
  msgtoSend :string=null;
  public selectedUser :User;
  roomName:String="chating";
  vu:boolean=false;
  allMsg:Msg[];
  msgSelectedU:Msg[];
  msgCurrentUr:Msg[];

  constructor(private authServ:AuthServService,private userServ:UserServService,private msgServ:MsgService) { 
  
  }

  ngOnInit(): void {
    this.currentUser= this.authServ.getUserFromLocalCache().username;
    this.currentu=this.authServ.getUserFromLocalCache();
    this.users=this.userServ.getUsersFromLocalCache();
   this.sortUsers(this.users);
   


 
  }



  
public sortUsers(users:User[]):void{
  this.users.sort((a: User, b: User) => {
    let date1 = new Date(a.lastLoginDateDisplay);
    let date2 = new Date(b.lastLoginDateDisplay);
    
    if (date1 > date2) {
    return -1;}
    
  else if (date1 < date2) {
    return 1;
    }
     else {
    return 0; } 
  });
}


public sortMsgs(msgs:Msg[]):void{
 msgs.sort((a: Msg, b: Msg) => {
    let date1 = new Date(a.dateCreation);
    let date2 = new Date(b.dateCreation);
    
    if (date1 > date2) {
    return 1;}
    
  else if (date1 < date2) {
    return -1;
    }
     else {
    return 0; } 
  });
}

  public onSelectUser(selectedUser:User):void{
    this.selectedUser=selectedUser;
    this.getMsgs();
    this.onUpdateMsg();

this.getMsgByselectedU()

this.getMsgByCurrentU();
  console.log(this.selectedUser);}


  public searchUsers(searchTerm:string ):void{
    console.log(searchTerm);
     const results: User[]=[];
     for(const user of this.userServ.getUsersFromLocalCache()){
    console.log(user) ;
     console.log("test2"+user.username)
       if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1 ) {
           results.push(user); 
           console.log(results);
           this.users=results;
   console.log(this.users);
   
       }}
            this.users=results;
   if(results.length === 0 || !searchTerm){
     this.users=this.userServ.getUsersFromLocalCache();
     console.log("err")
   } 
       
   }
   getMsgs(){
    this.msgServ.getMsgSenderAndReciver(this.currentu.id,this.selectedUser.id).subscribe((data:Msg[])=>{
      this.allMsg=data;
      this.sortMsgs(this.allMsg);

      console.log(data);
      
    })
   }

   getMsgByCurrentU(){
    this.msgServ.getMsgSendAndRec(this.currentu.id,this.selectedUser.id).subscribe((data:Msg[])=>{
     this.sortMsgs(data);
     this.msgCurrentUr=data;
     this.sortMsgs(this.msgCurrentUr);
      console.log( this.msgCurrentUr);
      
    })
   }
   getMsgByselectedU(){
    this.msgServ.getMsgSendAndRec(this.selectedUser.id,this.currentu.id).subscribe((data:Msg[])=>{
      this.msgSelectedU=data;
      
      this.sortMsgs(this.msgSelectedU);
      this.msgServ.addMsgsToLocalCache(this.msgSelectedU);
      console.log(this.msgSelectedU);
      
    })
   }




   saveMsg(newMsgForm: Msg) {
    console.log(this.msgtoSend); 
   this.getMsgs();

     this.msgServ.saveMsg(newMsgForm).subscribe(data => {
  
      console.log(data);
      console.log("test")
      this.onUpdateMsg();

      this.getMsgs();

      this.getMsgByselectedU()

      this.getMsgByCurrentU();
      this.msgtoSend="";
    }, err => {
      console.log(err);
    });
    this.newMsg = new Msg();

  
  
  
   }




   public onUpdateMsg(): void {
    for(const msg of this.msgServ.getMsgsFromLocalCache()){
      console.log(msg) ;
       console.log("Msg")

         this.msgServ.updateMsg(msg.idMsg,msg).subscribe(
           (response: Msg) => {
              console.log(response);   
            },         
          )
        
    
      }}
    
  
}
