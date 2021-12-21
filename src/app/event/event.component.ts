import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from 'node-angular-http-client';
import { EMPTY } from 'rxjs';
import { findIndex, isEmpty } from 'rxjs/operators';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
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
  userNameListEdit: any[] = [];

  idList: number[] = [];

  editEvt:Event;
  selectedEvt:Event;
  deletedEvt:Event;
  searchedUsers: User[]=[];
  searchedUsers2: User[]=[];

  submitedFormEvt = false;
  messageFormEvt: string;

  events:Event [];
  eventsByuserActuel:Event [];
  userOfEventSelected:User[]=[];
  hiddenMyEvent:boolean=false;
  hiddenEventInvite:boolean=false;

  allEvents:Event[]=[];

  myArchiveEvent:Event[]=[];
  allArchiveEvent:Event[]=[];

  constructor(private eventServ: EventServService, private auth: AuthServService, private userServ: UserServService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.userActuel = this.auth.getUserFromLocalCache();
this.getUsers();
    console.log("users")

  this.getEvtListe();
this.getEvtListeByuserActuel();  
this.getMyArchiveEvt();
this.getAllArchiveEvt();


 this.getAllListe()
        
}




// detail event (liste des users) 
public onSelectEvt(selectedEvt: Event): void {
  this.userOfEventSelected=[];
  this.selectedEvt= selectedEvt;
  console.log(this.selectedEvt.invitedPersons)


  for (let j = 0; j < this.users.length; j++) {

    for (let i = 0; i < this.selectedEvt.invitedPersons.length; i++) {
    if(this.users[j].id==this.selectedEvt.invitedPersons[i]){
  
      this.userOfEventSelected.push(this.users[j]) }}}
    
console.log("liste invited")
console.log(this.userOfEventSelected)
 document.getElementById('openEventInfo').click();

}


//liste edit Evt 

public onEditEvt(editEvt: Event): void {
  this.userNameListEdit=[];
  this.editEvt = editEvt;
  console.log(this.editEvt)


  for (let i = 0; i < this.editEvt.invitedPersons.length; i++) {
  for (let j = 0; j < this.users.length; j++) {
    if(this.users[j].id==this.editEvt.invitedPersons[i]){
    /*   console.log("meme nom")
      */
      this.userNameListEdit.push(this.users[j].username) 
    }}}
  document.getElementById('openEventEdit').click();

}


onUpdateEvt() {
  if(this.userActuel.role=="ROLE_ADMIN" || this.editEvt.eventUser.id== this.userActuel.id){

  this.eventServ.updateEvt(this.editEvt.id,this.editEvt).subscribe((data:Event) => {

    this.sendNotification(NotificationType.SUCCESS,`${data.subject} updated successfully.`);

    console.log(data);
   
    this.getEvtListe();
    this.getEvtListeByuserActuel(); 
    this.getMyArchiveEvt();
    this.getAllArchiveEvt();
    this.getAllListe();

  
    this.clickButton('closeEventEdit');
    this.userNameListEdit=[];

    
  },(errorResponse: HttpErrorResponse) => {
    console.log(errorResponse);
    this.userNameListEdit=[];

    this.sendNotification(NotificationType.ERROR, errorResponse.error.message );
  }
  )}else {{
    this.sendNotification(NotificationType.ERROR, "you don't have permission ");
    this.clickButton('edit-evt-close');
    this.userNameListEdit=[];
  }

  }
}




remplirIdList2(){for (let j = 0; j < this.users.length; j++) {

  for (let i = 0; i < this.userNameListEdit.length; i++) {
  if(this.users[j].username==this.userNameListEdit[i]){
  /*   console.log("meme nom")
    */
    this.idList.push(this.users[j].id) 
  
  }else{console.log("non")
  /* console.log(this.users[j].username)
  console.log(this.userNameList[i]) */
  
  }
  
  }}}
  


  removeUserFromList2( username:string){
    this.userNameListEdit=this.userNameListEdit.filter(obj => obj !== username);
    let c=<HTMLInputElement> document.getElementById("checkUsername2"+username);
    c.checked=false
   
  }
 addUserToList2( username:string){
   let c=<HTMLInputElement> document.getElementById("checkUsername2"+username);
   if(c.checked==true){
    this.userNameListEdit.push(username);
   }else{
    this.userNameListEdit=this.userNameListEdit.filter(obj => obj !== username);
   }
  console.log(this.userNameListEdit)
 }
 
 existUserName2(username:string):boolean{
for(let str of this.userNameListEdit){
  if(str==username){
    return true;
  }
}
  return false;
 }
 existInSearchedList2(username:string):boolean{
for(let str of this.searchedUsers){
  if(str.username==username){
    return true;
  }
}
  return false;
 }



  public searchUser2(searchTerm:string){
  
    const searchedUsers2: User[] = [];
    if(searchTerm==""){
        this.searchedUsers2 = [];
    }else{
      document.getElementById("searchBox2").hidden=false;

      for(const user of this.userServ.getUsersFromLocalCache().filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner")){
        if(user!=null && user.username!=null){
           if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1  ) {
            searchedUsers2.push(user); 
        this.searchedUsers2 = searchedUsers2;
              
           }}
         }
    }
    for(let str of this.userNameListEdit){
      if(!this.existInSearchedList(str)){
       let  usr=new User();
       usr.username=str
           this.searchedUsers2.push(usr);
      }
              
  }

}






 


//add new event 



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
      this.getEvtListe();
      this.getEvtListeByuserActuel();  
      this.getMyArchiveEvt();
      this.getAllArchiveEvt();
      this.getAllListe();

      this.userNameList=[];
      this.clickButton('closeEventAdd');
    
      this.sendNotification(NotificationType.SUCCESS, `${data.subject} added successfully . `);
      this.submitedFormEvt = true;
     // this.messageFormEvt = 'Event  added successfully .... ';
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.userNameList=[];
      this.event = new Event();

      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
    }/*  err => {
          this.messageFormDOc = 'Erreur! Vérifier votre Document ... ';
          console.log(err);
        } */);
    this.event = new Event();
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

  public onSelectevt(selectedevt: Event): void {
 

    this.selectedEvt = selectedevt;
    console.log(this.selectedEvt)
   
  
   document.getElementById('openEventInfo').click();
  
  }
  
 
//archiver et restore 


onRestoreEvt(evt:Event) {
  console.log("evt to restore")
  console.log(evt.archive)
  this.eventServ.restoreEvt(evt.id,evt).subscribe(() => {
      
    this.getEvtListe();
    this.getEvtListeByuserActuel(); 
    this.getMyArchiveEvt();
    this.getAllArchiveEvt();
    this.getAllListe();

    this.sendNotification(NotificationType.INFO, `Event restored  successfully.`);

    console.log('Event  restored ... !!!');
  
    
  }, (errorResponse: HttpErrorResponse) => {
    console.log(errorResponse);
    this.sendNotification(NotificationType.ERROR, errorResponse.error.message );
  });
}



  onArchiveEvt(evt:Event) {
    if(this.userActuel.role=="ROLE_ADMIN" || evt.eventUser.id== this.userActuel.id){

    this.eventServ.archiveEvt(evt.id,evt).subscribe(() => {
      this.sendNotification(NotificationType.INFO, `Event archived  successfully.`);

      console.log('Event  archived ... !!!');
     // this.getAllDocuments();
   
      this.getEvtListe();
      this.getEvtListeByuserActuel();  
      this.getMyArchiveEvt();
      this.getAllArchiveEvt();
      this.getAllListe();

    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  });} else {
      this.sendNotification(NotificationType.ERROR, "you don't have permission ");
    } 
  }
  
//Delete event

deleteEvt(evt:Event) {
  //if(this.userActuel.role=="ROLE_ADMIN" || doc.docUser.id== this.userActuel.id){
    this.deletedEvt= evt;
console.log("delete evt")
    console.log(evt)
console.log(this.deletedEvt)
  this.eventServ.deleteEvent(this.deletedEvt.id).subscribe(() => {
   
    console.log('Event  deleted ... !!!');
    this.sendNotification(NotificationType.SUCCESS, "success deleting");

    this.getEvtListe();
    this.getEvtListeByuserActuel(); 
    this.getMyArchiveEvt();
    this.getAllArchiveEvt();
    this.getAllListe();


  
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  });
}


  //listes des events
  public sortevents(events:Event[]):void{
    events.sort((a: Event, b: Event) => {
      let date1 = new Date(a.startDate);
      let date2 = new Date(b.startDate);
      
      if (date1 > date2) {
      return 1;}
      
    else if (date1 < date2) {
      return -1;
      }
       else {
      return 0; } 
    });
  }

  getEvtListe(){
    this.eventServ.getEventInvited(this.userActuel.id).subscribe((data:Event[])=>{
    console.log(data);
    this.events=data;
    console.log("tri")
    this.events=this.events.filter(evt=>evt.eventUser.id!=this.userActuel.id)
    this.sortevents(this.events);
    console.log(this.events)
    if(this.events.length!=0){this.hiddenEventInvite=true}
    }
    )

    
  }



  getAllListe(){
if(this.isAdmin==true){
    this.eventServ.getallEventNoArchive().subscribe((data:Event[])=>{
      console.log("all events")
    this.allEvents=data.filter(u=>u.eventUser.id!=this.userActuel.id);
    console.log("tri")
    this.sortevents(this.allEvents);
    console.log(this.allEvents);
  
  }
    )  }
    else{console.log("non")}
  }



  getEvtListeByuserActuel(){
    this.eventServ.getEventCreated(this.userActuel.id).subscribe((data:Event[])=>{
    console.log(data);
    this.eventsByuserActuel=data;
    this.sortevents(this.eventsByuserActuel);
    if(this.eventsByuserActuel.length!=0){this.hiddenMyEvent=true}}
    )

    
  }


  getMyArchiveEvt(){
    this.eventServ.getMyEventArchive(this.userActuel.id).subscribe((data:Event[])=>{
    console.log(data);
    this.myArchiveEvent=data;
    this.sortevents(this.myArchiveEvent);}
   
    )

    
  }

  getAllArchiveEvt(){
    this.eventServ.allEvtArchive().subscribe((data:Event[])=>{
    console.log(data);
    this.allArchiveEvent=data;
    this.sortevents(this.allArchiveEvent);}
   
    )

    
  }

  
  
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);

    } else {
      this.notificationService.notify(notificationType, 'An error occured . Please try again.')
    }
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }
  ngAfterViewChecked(){
    var x = document.getElementsByClassName("item pointer");
    if(x.length>0){
      x[0].className="item active pointer"
    }
  
    var y = document.getElementsByClassName("item pointer");
    if(y.length>0){
      y[0].className="item active pointer"
    }
  
  }
  

//

//get role 
private getUserRole():string{
  return this.auth.getUserFromLocalCache().role;
}

public get isAdmin():boolean{
  return this.getUserRole()===Role.ADMIN;
}

public get isScrumMaster():boolean{
  return this.isAdmin ||this.getUserRole()===Role.SCRUM_MASTER;
}
public get isScrumMasterOnly():boolean{
  return this.getUserRole()===Role.SCRUM_MASTER;
}




public get isAdminOrScrumMasterOrProductOwner():boolean{
  return this.isAdmin ||this.isScrumMaster||this.isProductOwner;
}

public get isProductOwner():boolean{
  return  this.getUserRole()===Role.PRODUCT_OWNER;}







  public getUsers():void{
    this.userServ.getUsers().subscribe(
      (response:User[])=>{
  
       // console.log(response);
        this.userServ.addUsersToLocalCache(response);
        this.users=response.filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner");
      
      }
    );
    
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
function notificationType(notificationType: any, message: any) {
  throw new Error('Function not implemented.');
}

