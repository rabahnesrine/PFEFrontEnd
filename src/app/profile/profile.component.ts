import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { NotificationService } from '../Services/notification.service';
import { UserServService } from '../Services/user-serv.service';
import {NgForm} from '@angular/forms';
import { CustomHttpResponse } from '../models/custom-http-response';
import { Router } from '@angular/router';
import { FileUploadStatus } from '../models/file-upload.status';
import { Role } from '../enum/role.enum';
@Component({
  selector: 'app-profile',
  templateUrl:'./profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy {
  private titleSubject= new BehaviorSubject<string>('Users');    //actual subject
  public titleAction$=this.titleSubject.asObservable(); //action listener
 
 public users: User[]; 
 public user: User; //user actual 
 public refreshing: boolean;
 private subscriptions :Subscription[]=[];
 public selectedUser :User;
 public fileName:string;
 public profileImage:File;
 public editUser= new User() ;
 public currentUsername:string;
 public fileStatus= new FileUploadStatus();
 
 allUsers:any;
 //projection 
 public size:number=5;
 public currentPage:number=0;
 public totalPages:number;
 public pages:Array<number>;
 public currentKeyword:string="";
 
  constructor(private router:Router, private userServ: UserServService,private authServ:AuthServService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.user= this.authServ.getUserFromLocalCache(); // recupere user actuel 
  console.log(this.authServ.currentUserlogged());
  }



  public updateProfileImage():void{
    this.clickButton('profile-image-input');
  
  }

  public onLogOut(): void{
    this.authServ.logOut();
    this.router.navigateByUrl('/login');
    this.sendNotification(NotificationType.SUCCESS,`you've been successfully logged out ` );
  
  
  }


  public onUpdateProfileImage():void{
    const formData=new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subscriptions.push(
      this.userServ.updateProfileImage(formData).subscribe(
        (event:HttpEvent<any>)=>{
    console.log(event);
    this.reportUploadProgress(event);
   //   this.sendNotification(NotificationType.SUCCESS,`Profile image updated successfully . `);
  
   },
   (errorResponse:HttpErrorResponse)=>{
           this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
           this.fileStatus.status='done';
  
         }
         )
         );
  }
   private  reportUploadProgress(event: HttpEvent<any>):void {
      switch(event.type){
        case HttpEventType.UploadProgress: 
        this.fileStatus.percentage=Math.round(100* event.loaded/event.total);
        this.fileStatus.status='progress';
        break;
        case HttpEventType.Response: 
        if(event.status ==200){
          this.user.profileImageUrl=`${event.body.profileImageUrl}?time=${new Date().getTime()}` ;
          this.sendNotification(NotificationType.SUCCESS,`${event.body.username}\'s image updated successfully . `);
          this.fileStatus.status='done';
  break;
        }else {
          this.sendNotification(NotificationType.ERROR,`unable to upload image .Please try again . `);
        break;}
  
        default: `Finished all processes`;
  
      }
  }
  
  public onUpdateCurrentUser(user:User):void{
    this.refreshing=true;
    this.currentUsername = this.authServ.getUserFromLocalCache().username;
    const formDataa=this.userServ.createUserFormData(this.currentUsername,user, this.profileImage);
   
    this.subscriptions.push(
       this.userServ.updateUser(formDataa).subscribe(
         (response:User)=>{
      console.log("response"+ response);
    this.authServ.addUserToLocalCache(response);
   //   this.getUsers(false); // false pour n'est pas affiche le message pop
       this.fileName= null;
       this.profileImage= null;
       this.sendNotification(NotificationType.SUCCESS,`${response.username} updated successfully . `);
  
    },
    (errorResponse:HttpErrorResponse)=>{
      console.log(errorResponse);
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            this.profileImage= null;
  
          }
          )
          );
  
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
  //click button refresh automatically
   //this.el= this.refreshButton.nativeElement;
  //this.el.click();
  document.getElementById("refreshButton").click();
}

  public onProfileImageChange(fileName:string,profileImage:File):void{
    console.log(fileName,profileImage);
    this.fileName=fileName;
    this.profileImage=profileImage;
  }
  
  private clickButton(buttonId:string):void{
    document.getElementById(buttonId).click();
  }
  
private  sendNotification(notificationType: NotificationType, message: string):void {
  if(message){
    this.notificationService.notify(notificationType,message);
  
  } else {
    this.notificationService.notify(notificationType,'An error occured . Please try again.')
  } }
 
  

  //get role 
private getUserRole():string{
  return this.authServ.getUserFromLocalCache().role;
}

public get isAdmin():boolean{
  return this.getUserRole()=== Role.ADMIN;
}

public get isScrumMaster():boolean{
  return this.isAdmin ||this.getUserRole()=== Role.SCRUM_MASTER;
}

public get isAdminOrScrumMaster():boolean{
  return this.isAdmin ||this.isScrumMaster;
}


ngOnDestroy():void{
  this.subscriptions.forEach(sub=>sub.unsubscribe());
}
}
