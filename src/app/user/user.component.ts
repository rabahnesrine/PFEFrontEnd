import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
 private titleSubject= new BehaviorSubject<string>('Users');    //actual subject
 public titleAction$=this.titleSubject.asObservable(); //action listener
// @ViewChild('refreshButton') refreshButton: ElementRef<HTMLElement>;
// public el: HTMLElement;
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

public size:number=5;
public currentPage:number=0;
public totalPages:number;
public pages:Array<number>;
public currentKeyword:string="";



  constructor(private router:Router, private userServ: UserServService,private authServ:AuthServService, private notificationService: NotificationService) { 

  }

 
  ngOnInit(): void {
  this.getUsers(false);
  this.user= this.authServ.getUserFromLocalCache(); // recupere user actuel 
  console.log(this.authServ.currentUserlogged());
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
  //click button refresh automatically
   //this.el= this.refreshButton.nativeElement;
  //this.el.click();
  document.getElementById("refreshButton").click();
}

public searchUsers(searchTerm:string ):void{
 console.log(searchTerm);
  const results: User[]=[];
  for(const user of this.userServ.getUsersFromLocalCache()){
 console.log(user) ;
  console.log("test2"+user.username)
    if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1 ||
    user.userId.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1 ||
    user.email.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1 ||
    user.professionUser.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1 ) {
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


public onUpdateUser():void{
  console.log(this.user.username,this.user.role)
  const formDataa=this.userServ.createUserFormData(this.currentUsername,this.editUser, this.profileImage);
 //console.log("test current"+this.currentUsername);
 // console.log(formDataa);
 // console.log("user edit "+this.editUser.username)
 if(this.user.role== "ROLE_ADMIN"||this.user.role== "ROLE_SCRUM_MASTER"){
   
  this.subscriptions.push(
     this.userServ.updateProfile(formDataa).subscribe(
       (response:User)=>{
    console.log("response"+ response);
    this.clickButton('edit-user-close');
     this.getUsers(false); // false pour n'est pas affiche le message pop
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
        );}else {
          this.sendNotification(NotificationType.ERROR, "you don't have permission");
            this.clickButton('edit-user-close');
             this.getUsers(false); 
        }    
      
       

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



public updateProfileImage():void{
  this.clickButton('profile-image-input');

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
    this.getUsers(false); // false pour n'est pas affiche le message pop
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

public onLogOut(): void{
  this.authServ.logOut();
  this.router.navigateByUrl('/login');
  this.sendNotification(NotificationType.SUCCESS,`you've been successfully logged out ` );


}





public onEditUser(editUser:User):void{
  this.editUser=editUser;
  console.log("edit  "+ editUser.username);
  this.currentUsername= editUser.username;
  this.clickButton('openUserEdit');
}

 public onResetPassword(emailForm: NgForm): void{

  this.refreshing=true;
 const emailAddress=emailForm.value['reset-password-email'];
  console.log(emailAddress);

  this.subscriptions.push(
    this.userServ.resetPassword(emailAddress).subscribe(
      (response:CustomHttpResponse)=>{
        this.sendNotification(NotificationType.SUCCESS, response.message);
        this.refreshing=false;
      },
      (error:HttpErrorResponse)=>{
        this.sendNotification(NotificationType.WARNING, error.error.message);
        this.refreshing=false;
      },
      ()=> emailForm.reset()
    
    )
  );
 }




public onDeleteUser(id:number):void{
  this.subscriptions.push(
    this.userServ.deleteUser(id).subscribe(
      (response: CustomHttpResponse)=>{
        this.sendNotification(NotificationType.SUCCESS, "success deleting");
        
        this.getUsers(true);
      },(errorResponse:HttpErrorResponse)=>{
        console.log(errorResponse);
              this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
    
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
 
  


 /* public  getAllUsers() {
      
      this.userServ.getAllUsers().subscribe( data => {
        this.allUsers=data;
        console.log(this.authServ.getToken());

        console.log(data);
      }, err => {
        console.log(  err);
      });
    }*/


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
