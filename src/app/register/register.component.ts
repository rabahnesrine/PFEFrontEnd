import { HttpErrorResponse} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit , OnDestroy {
public showLoading :boolean ;
private subscriptions: Subscription[]=[];


  constructor(private router:Router,private authServ:AuthServService,private notificationService:NotifierService) { }
 

  ngOnInit(): void {
    if(this.authServ.isLoggedIn()){
      this.router.navigateByUrl('/user/management');

    }
  }


  
  public onRegister(user:User):void{
    this.showLoading=true;
    console.log(user );
    this.subscriptions.push(
      this.authServ.register(user).subscribe(
        (response:User)=>{
          console.log(response);
           this.showLoading=false;
           this.sendNotification(NotificationType.SUCCESS,`A new account was created for  ${response.username} Please check your email for password to log in .`);

  },(errorResponse:HttpErrorResponse)=>{
  console.log(errorResponse);
  this.sendNotification(NotificationType.ERROR,errorResponse.error.message);
  this.showLoading=false;
  }
  ));}
  

  private  sendNotification(notificationType: NotificationType, message: string):void {
    if(message){
      this.notificationService.notify(notificationType,message);
    
    } else {
      this.notificationService.notify(notificationType,'An error occured . Please try again.')
    } }
    
    ngOnDestroy():void{
      this.subscriptions.forEach(sub=>sub.unsubscribe());
    }
  }


