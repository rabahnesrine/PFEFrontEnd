import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { NotificationService } from '../Services/notification.service';
import { UserServService } from '../Services/user-serv.service';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import { CustomHttpResponse } from '../models/custom-http-response';
import { Router } from '@angular/router';
import { FileUploadStatus } from '../models/file-upload.status';
import { Role } from '../enum/role.enum';
import { TaskService } from '../Services/task.service';
import { Task } from '../models/Task';
import { Sprint } from '../models/Sprint';
import { SprintService } from '../Services/sprint.service';
import { Projet } from '../models/Projet';
import { ProjetServService } from '../Services/projet-serv.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl:'./user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit,OnDestroy {
 private titleSubject= new BehaviorSubject<string>('Users');    //actual subject
 public titleAction$=this.titleSubject.asObservable(); //action listener




 emailT:string;
 userEmails = new FormGroup({
   emailUserInput: new FormControl('',[
     Validators.required,
     Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
   });
 
   get inputEmail(){
     return this.userEmails.get('emailUserInput')
     } 


public users: User[]; 
public usersForSM: User[];
public userslist: User[]; 



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

public userTochange :User;
//task
public tasks:Task[];
public tasksTochange:Task[];
public anonymeMember:User;
//sprint
public sprints:Sprint[];
public sprintsTochange:Sprint[];
public anonymeChef:User;
//projet
public projets:Projet[];
public projetsTochange:Projet[];
public anonymeProductowner:User;



public plein :boolean=true;
  constructor(private router:Router, private userServ: UserServService,private authServ:AuthServService, private notificationService: NotificationService,private taskServ:TaskService,private sprintServ:SprintService,private projetServ:ProjetServService) { 

  }
  

 
  ngOnInit(): void {
  this.getUsers(false);
  this.user= this.authServ.getUserFromLocalCache(); // recupere user actuel 
  console.log(this.authServ.currentUserlogged());
//this.getAllUsers() ;

this.tasks=this.taskServ.getTasksFromLocalCache();
this.sprints=this.sprintServ.getSprintsFromLocalCache();
this.projets=this.projetServ.getProjetsFromLocalCache();
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
      this.userslist=response.filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner");
      this.usersForSM=this.userslist.filter(u=>u.role!="ROLE_ADMIN");
      this.refreshing=false;
      if(showNotification){
        if(this.user.role=="ROLE_ADMIN"){
this.sendNotification(NotificationType.SUCCESS,`${this.userslist.length} user(s) loaded successfully . `);}
else{
  this.sendNotification(NotificationType.SUCCESS,`${this.usersForSM.length} user(s) loaded successfully . `);

}
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
  this.users=this.userServ.getUsersFromLocalCache();
  this.userslist=this.users.filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner");

  if(this.user.role=="ROLE_ADMIN"){
  for(const user of this.userslist){
 console.log(user) ;
  console.log("test2"+user.username)
    if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1 ||
    user.userId.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1 ||
    user.email.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1 ||
    user.isActive.toString().indexOf(searchTerm.toLowerCase())!==-1 ||
    user.professionUser.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1 ) {
        results.push(user); 
        console.log(results);
        this.userslist=results;
console.log(this.userslist);

    }}
         this.userslist=results;
if(results.length === 0 || !searchTerm){
  this.users=this.userServ.getUsersFromLocalCache();
  this.userslist=this.users.filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner");

  console.log("err")
} }
if (this.user.role=="ROLE_SCRUM_MASTER"){
  this.usersForSM=this.userslist.filter(u=>u.role!="ROLE_ADMIN");


  for(const user of this.usersForSM){
    console.log(user) ;
     console.log("test2"+user.username)
       if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1 ||
       user.userId.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1 ||
       user.email.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1 ||
       user.isActive.toString().indexOf(searchTerm.toLowerCase())!==-1 ||
       user.professionUser.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1 ) {
           results.push(user); 
           console.log(results);
           this.usersForSM=results;
   console.log(this.usersForSM);
   
       }}
            this.usersForSM=results;
   if(results.length === 0 || !searchTerm){
     this.users=this.userServ.getUsersFromLocalCache();
     this.userslist=this.users.filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner");
     this.usersForSM=this.userslist.filter(u=>u.role!="ROLE_ADMIN");

     console.log("err")
   } 





}



    
}


public onUpdateUser():void{
  console.log(this.user.username,this.user.role,this.editUser.role);
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




public onDeleteUser(username:string):void{
console.log(username)
 this.userTochange=this.users.find(u=>u.username==username)
 console.log(this.userTochange)
if(this.userTochange.role==="ROLE_MEMBER"||this.userTochange.role==="ROLE_PRODUCT_OWNER"||this.userTochange.role==="ROLE_CHEF"){
      this.onChange(this.userTochange.username);

  this.subscriptions.push(
    this.userServ.deleteUser(username).subscribe(
      (response: CustomHttpResponse)=>{
        this.sendNotification(NotificationType.SUCCESS, "success deleting");
        
        this.getUsers(true);
        this.userTochange=null;
      },(errorResponse:HttpErrorResponse)=>{
        console.log(errorResponse);
              this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
    
            }

    )
  ); }
  else{
            this.subscriptions.push(
              this.userServ.deleteUser(username).subscribe(
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

}



private onChange(username:String){
  this.userTochange=this.users.find(u=>u.username==username)

//Member
 if(this.userTochange.role=="ROLE_MEMBER"){
  this.anonymeMember=this.users.find(u=>u.username=="AnonymeMember");
 
  this.tasksTochange= this.tasks.filter(t=>t.memberAffecter.username==username)
  if(!this.tasksTochange){
  for (let i = 0; i < this.tasksTochange.length; i++) {
   this.tasksTochange[i].memberAffecter=this.anonymeMember;
 
    this.taskServ.updateTask(this.tasksTochange[i].idTask,this.tasksTochange[i]).subscribe(
     (response: Task) => {
        console.log(response);
 });
 } this.taskServ.addTasksToLocalCache(this.tasksTochange);
  return this.plein=true

}else{ return this.plein=false;}
 } else
//chef 
if(this.userTochange.role=="ROLE_CHEF"){
  this.anonymeChef=this.users.find(u=>u.username=="AnonymeChef");
 
  this.sprintsTochange= this.sprints.filter(t=>t.chefAffecter.username==username)
  if(!this.sprintsTochange){

  for (let i = 0; i < this.sprintsTochange.length; i++) {
   this.sprintsTochange[i].chefAffecter=this.anonymeChef;
 
    this.sprintServ.updateSprint(this.sprintsTochange[i].idSprint,this.sprintsTochange[i]).subscribe(
     (response: Sprint) => {
        console.log(response);
 });
 }
 this.plein=true
 this.sprintServ.addSprintsToLocalCache(this.sprintsTochange);
}else{this.plein=false}
 } else


//productowner
if(this.userTochange.role=="ROLE_PRODUCT_OWNER"){
  this.anonymeProductowner=this.users.find(u=>u.username=="AnonymeProductOwner");
 
  this.projetsTochange= this.projets.filter(t=>t.client.username==username)
  if(!this.projetsTochange){
  for (let i = 0; i < this.projetsTochange.length; i++) {
   this.projetsTochange[i].client=this.anonymeProductowner;
 
    this.projetServ.updateProjet(this.projetsTochange[i].idProjet,this.projetsTochange[i]).subscribe(
     (response: Projet) => {
        console.log(response);
 });
 }
 this.plein=true;
 this.projetServ.addProjetsToLocalCache(this.projetsTochange);
}else{this.plein=false}
 }

}


private isEmpty(username:String):any{
  this.userTochange=this.users.find(u=>u.username==username)

//Member
 if(this.userTochange.role=="ROLE_MEMBER"){
  this.anonymeMember=this.users.find(u=>u.username=="AnonymeMember");
 
  this.tasksTochange= this.tasks.filter(t=>t.memberAffecter.username==username)
  if(this.tasksTochange.length!=0){
    this.plein=true;
    return true;
  }else{this.plein=false
    return false;
  }
 
 
 }
//chef 
if(this.userTochange.role=="ROLE_CHEF"){
  this.anonymeChef=this.users.find(u=>u.username=="AnonymeChef");
 
  this.sprintsTochange= this.sprints.filter(t=>t.chefAffecter.username==username)
  if(this.sprintsTochange.length!=0){
    this.plein=true;
    return true;
  }else{this.plein=false
    return false;
  }
 
 }


//productowner
if(this.userTochange.role=="ROLE_PRODUCT_OWNER"){
  this.anonymeProductowner=this.users.find(u=>u.username=="AnonymeProductOwner");
 
  this.projetsTochange= this.projets.filter(t=>t.client.username==username)
  if(this.projetsTochange.length!=0){
    this.plein=true;
    return true;
  }else{this.plein=false
    return false;
  }

}}


private  sendNotification(notificationType: NotificationType, message: string):void {
  if(message){
    this.notificationService.notify(notificationType,message);
  
  } else {
    this.notificationService.notify(notificationType,'An error occured . Please try again.')
  } }
 
  





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
