import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from 'node-angular-http-client';
import { EMPTY } from 'rxjs';
import { findIndex, isEmpty } from 'rxjs/operators';
import { NotificationType } from '../enum/notification-type.enum';
import { Event } from '../models/event';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { EventServService } from '../Services/event-serv.service';
import { NotificationService } from '../Services/notification.service';
import { UserServService } from '../Services/user-serv.service';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit,AfterViewChecked {
  selectedUser: User;
  
  event: Event = new Event();
  userActuel: User;
  users: User[];
  userNameList: any[] = [];
  idList: number[] = [];


  selectedEvt:Event;

  searchedUsers: User[]=[];
  submitedFormEvt = false;
  messageFormEvt: string;

  events:Event [];
  eventsByuserActuel:Event [];

  hiddenMyEvent:boolean=false;
  hiddenEventInvite:boolean=false;

  constructor(private eventServ: EventServService, private auth: AuthServService, private userServ: UserServService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.userActuel = this.auth.getUserFromLocalCache();
this.getUsers();
    console.log("users")

  this.getEvtListe();
this.getEvtListeByuserActuel();  



}


public getUsers():void{
  this.userServ.getUsers().subscribe(
    (response:User[])=>{

      console.log(response);
      this.userServ.addUsersToLocalCache(response);
      this.users=response.filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner");
    
    }
  );
  

}



public onSelectEvt(selectedEvt: Event): void {
  this.selectedEvt= selectedEvt;
  console.log(this.selectedEvt)
 document.getElementById('openEventInfo').click();

}









ngAfterViewChecked(){
  var x = document.getElementsByClassName("item pointer");
  if(x.length>0){
    x[0].className="item active pointer"
  }

}












  getEvtListe(){
    this.eventServ.getEventInvited(this.userActuel.id).subscribe((data:Event[])=>{
    console.log(data);
    this.events=data;
    if(this.events.length!=0){this.hiddenEventInvite=true}
    }
    )

    
  }
  getEvtListeByuserActuel(){
    this.eventServ.getEventCreated(this.userActuel.id).subscribe((data:Event[])=>{
    console.log(data);
    this.eventsByuserActuel=data;
    if(this.eventsByuserActuel.length!=0){this.hiddenMyEvent=true}}
    )

    
  }



remplirIdList(){for (let j = 0; j < this.users.length; j++) {

  for (let i = 0; i < this.userNameList.length; i++) {
  if(this.users[j].username==this.userNameList[i]){
  /*   console.log("meme nom")
    */
    this.idList.push(this.users[j].id) 
  
  }else{console.log("non")
  /* console.log(this.users[j].username)
  console.log(this.userNameList[i]) */
  
  }
  
  }}}
  


  saveEvent() {
console.log("saveEvent")
console.log(this.userNameList)  


this.remplirIdList();
    console.log(this.event)
    this.event.invitedPersons=this.idList;
    this.event.eventUser = this.userActuel;
    this.eventServ.addEvent(this.event).subscribe((data: Event) => {
      console.log(data);

      this.sendNotification(NotificationType.SUCCESS, `${data.subject} added successfully . `);
this.userNameList=[];
      this.submitedFormEvt = true;
     // this.messageFormEvt = 'Event  added successfully .... ';
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
    }/*  err => {
          this.messageFormDOc = 'Erreur! Vérifier votre Document ... ';
          console.log(err);
        } */);
    this.event = new Event();
  }



  public onSelectEvent(selectedEvt: Event): void {


    /*  this.selectedDoc = selectedDoc;
     console.log(this.selectedDoc)
     */

    document.getElementById('openEventInfo').click();

  }







  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);

    } else {
      this.notificationService.notify(notificationType, 'An error occured . Please try again.')
    }
  }



  removeUserFromList( username:string){
    this.userNameList=this.userNameList.filter(obj => obj !== username);
    let c=<HTMLInputElement> document.getElementById("checkUsername"+username);
    c.checked=false
   
  }
 addUserToList( username:string){
   let c=<HTMLInputElement> document.getElementById("checkUsername"+username);
  
   if(c.checked==true){
    this.userNameList.push(username);
   }else{
    this.userNameList=this.userNameList.filter(obj => obj !== username);
   }
  console.log(this.userNameList)
 }
 
 existUserName(username:string):boolean{
for(let str of this.userNameList){
  if(str==username){
    return true;
  }
}
  return false;
 }
 existInSearchedList(username:string):boolean{
for(let str of this.searchedUsers){
  if(str.username==username){
    return true;
  }
}
  return false;
 }



  public searchUser(searchTerm:string){
  
    const searchedUsers: User[] = [];
    if(searchTerm==""){
        this.searchedUsers = [];
    }else{
      document.getElementById("searchBox").hidden=false;
      for(const user of this.userServ.getUsersFromLocalCache().filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner")){
        if(user!=null && user.username!=null){
           if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1  ) {
            searchedUsers.push(user); 
        this.searchedUsers = searchedUsers;
              
           }}
         }
    }
    for(let str of this.userNameList){
      if(!this.existInSearchedList(str)){
       let  usr=new User();
       usr.username=str
           this.searchedUsers.push(usr);
      }
              
  }

}



  public saveNewEvt(): void {
    this.clickButton('new-evt-save');
    this.clickButton('new-evt-close');

    console.log("eventsave fonction ");

  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }







   /*  public searchUsers(searchTerm: string): void {
    console.log(searchTerm);
    const results: User[] = [];
    this.intoSearchEvent=this.intolastEvent;
    for (const user of this.userServ.getUsersFromLocalCache()) {
      //console.log(user) ;
       //console.log("test2"+user.username)    

      if (user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        results.push(user);
        this.searchedUsers = results;
       

          for(let j=0;j<this.searchUsers.length;j++){
            for (let i = 0; i < this.users.length; i++) {

          if(user==this.users[i]){
            console.log("egaux")
            this.intoSearchEvent[j]=this.intolastEvent[i]
          }}

        }
       // console.log(this.users.find(u=>u.id==user.id));
        console.log("test into search")
        console.log(this.intoSearchEvent)
        //console.log(results);
        //   this.users=results;

       


        this.intoEvent=this.intoSearchEvent;
        console.log("this.intoEvent");

        console.log(this.intoEvent);



      }
    }
    this.searchedUsers = results;
    if (results.length === 0 || !searchTerm) {
      this.searchedUsers = this.userServ.getUsersFromLocalCache();
     this.intoEvent=this.intolastEvent;
      console.log("err")
    }

  }
 */

  /* public onSelectUser(selectedUser: User, j: number): void {
    this.selectedUser = selectedUser;
    console.log(this.selectedUser)

   
    for (let i = 0; i < this.users.length; i++) {
      if (this.selectedUser.username == this.users[i].username) {
        console.log("item true existe a la position" + i)
let index =i;

console.log("index"+index)
        if (this.intolastEvent[index] == false) {
          this.intolastEvent[index] = true;

        } else { 
          this.intolastEvent[index] = false;

        }
       // console.log(this.intolastEvent)

      } else {
        console.log("false")
      }
    //  console.log(this.intolastEvent)

    


    
  }
   
  }

 */
}
