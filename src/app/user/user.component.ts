import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { NotificationService } from '../Services/notification.service';
import { UserServService } from '../Services/user-serv.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl:'./user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
 private titleSubject= new BehaviorSubject<string>('Users');    //actual subject
 public titleAction$=this.titleSubject.asObservable(); //action listener

public users: User[]; 
public refreshing: boolean;
private subscriptions :Subscription[]=[];
allUsers:any;
public selectedUser :User;
public fileName:string;
public profileImage:File;

public size:number=5;
public currentPage:number=0;
public totalPages:number;
public pages:Array<number>;
public currentKeyword:string="";



  constructor( private userServ: UserServService,private authServ:AuthServService, private notificationService: NotificationService) { }

 
  ngOnInit(): void {
  this.getUsers(true);

//this.getAllUsers() ;
}
    
 

public changeTitle(title:string):void{
this.titleSubject.next(title);
}


public getUsers(showNotification:boolean):void{
  this.refreshing=true;
  this.subscriptions.push(
  this.userServ.getUsers().subscribe(
    (response:User[])=>{
      console.log(response);
      this.userServ.addUsersToLocalCache(response);
      this.users=response;
      this.refreshing=false;
      if(showNotification){
this.sendNotification(NotificationType.SUCCESS,`${response.length} user(s) loaded successfully . `);
      }
    },(errorResponse:HttpErrorResponse)=>{
console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
    this.refreshing=false;
    }
  )
  );
}

private  sendNotification(notificationType: NotificationType, message: string):void {
  if(message){
    this.notificationService.notify(notificationType,message);
  
  } else {
    this.notificationService.notify(notificationType,'An error occured . Please try again.')
  } }
 
  


  public  getAllUsers() {
      
      this.userServ.getAllUsers().subscribe( data => {
        this.allUsers=data;
        console.log(this.authServ.getToken());

        console.log(data);
      }, err => {
        console.log(  err);
      });
    }


public onSelectUser(selectedUser:User):void{
  this.selectedUser=selectedUser;
  document.getElementById('openUserInfo').click();

}
public saveNewUser():void{
  this.clickButton('new-user-save');
}

public onAddNewUser(userForm : NgForm): void{
  const formData=this.userServ.createUserFormData(null,userForm.value, this.profileImage);
  console.log(formData);
  this.subscriptions.push(
  this.userServ.addUser(formData).subscribe((response:User)=>{
    this.clickButton('new-user-close');
     this.getUsers(false); // false pour n'est pas affiche le message pop
     this.fileName= null;
     this.profileImage= null;
     userForm.reset(); 
     this.sendNotification(NotificationType.SUCCESS,`${response.username} added successfully . `);

  },
  (errorResponse:HttpErrorResponse)=>{
    console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage= null;

        }
        )
        );
}

public onProfileImageChange(fileName:string,profileImage:File):void{
  console.log(fileName,profileImage);
  this.fileName=fileName;
  this.profileImage=profileImage;
}

private clickButton(buttonId:string):void{
  document.getElementById(buttonId).click();
}



/*
onGetUsers(){
  this.userServ.getUsers(this.currentPage,this.size)
  .subscribe(data=>{
  this.totalPages=data["page"].totalPages;
this.pages=new Array<number>(this.totalPages);
this.user=data;},err=>{
      console.log(err);
  })
}

onPageUser(i){
  this.currentPage=i;
 //this.ChercherUsers();
  this.onGetUsers(); // pour charger les users de nouveau
 // this.onChercher({keyword:this.currentKeyword});

}


getlistUser(){
  this.userServ.findlist()
  .subscribe((reponse)=>{this.users=reponse
  },err=>console.log(err))

}




 /*  onGetUsers(){
    this.httpclient.get("http://localhost:8080/users").subscribe( (data)=>{
      this.users=data},(err)=>{console.log("err");})

  }
 */
}
