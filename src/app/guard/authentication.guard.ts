import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,  Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthServService } from '../Services/auth-serv.service';
import { NotificationService } from '../Services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {


  constructor(private authServ: AuthServService, private router:Router ,
    private notificationServ:NotificationService){}


  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):boolean  {
    if(this.authServ.isLoggedIn()){

      return true ;
    }
  this.router.navigate(['/login']);
  //send notif to user 
  this.notificationServ.notify(NotificationType.ERROR,`You need to log in to access this page`);
  return false;
  
  }  }

  

