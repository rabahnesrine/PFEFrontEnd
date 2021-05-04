import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from '../enum/header-type.enum';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { NotificationService } from '../Services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
public showLoading : boolean;
private subscriptions: Subscription[]=[];


  constructor(private router:Router,private authServ:AuthServService,private notificationService: NotificationService) { }

  ngOnInit(): void {
if(this.authServ.isLoggedIn()){
  this.router.navigateByUrl('/user/management');
}else {
  this.router.navigateByUrl('/login');
}}


public onLogin(user:User):void{
  this.showLoading=true;
  console.log(user);
  this.subscriptions.push(
    this.authServ.login(user).subscribe(
      (response:HttpResponse<User>)=>{
        const token =response.headers.get(HeaderType.JWT_TOKEN);
      //  console.log(token);
        this.authServ.saveToken(token);
        this.authServ.addUserToLocalCache(response.body); 
  this.router.navigateByUrl('/user/management')
  this.showLoading=false;
},(errorResponse:HttpErrorResponse)=>{
console.log(errorResponse);
this.sendErrorNotification(NotificationType.ERROR,errorResponse.error.message);
this.showLoading=false;
}
));}

private  sendErrorNotification(notificationType: NotificationType, message: string):void {
if(message){
  this.notificationService.notify(notificationType,message);

} else {
  this.notificationService.notify(notificationType,'An error occured . Please try again.')
} }


  
  ngOnDestroy():void{
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

}
