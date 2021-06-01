import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServService } from '../Services/auth-serv.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private  authServ: AuthServService) {}

 intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if(httpRequest.url.includes(`${this.authServ.host}/user/login`)) {
      return httpHandler.handle(httpRequest);
    }
    if(httpRequest.url.includes(`${this.authServ.host}/user/register`)) {
      return httpHandler.handle(httpRequest);
  }


this.authServ.loadToken(); //when the token is loaded we can access to this token  
const token=this.authServ.getToken();
console.log(token);
const request=httpRequest.clone({ setHeaders:{Authorization :`Bearer ${token}`}});
return httpHandler.handle(request);
}} 

