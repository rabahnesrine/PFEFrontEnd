import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import {environment} from '../../environments/environment'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AuthServService {

  public host=environment.apiUrl;
 private token: string;
 private loggedInUsername: string;
private jwtHelper =new JwtHelperService();
public username; 

  constructor(private http:HttpClient) {}




  public login(user: User):Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/user/login`,user ,{observe: 'response' });
  }

 

  public register(user: User):Observable<User> {
    return this.http.post<User>
    (`${this.host}/user/register`,user);
  }
 
  public logOut():void{
this.token = null;
this.loggedInUsername=null;
localStorage.removeItem('user');
localStorage.removeItem('token');
localStorage.removeItem('users');
}
 

public saveToken(token:string):void{
  this.token=token;
  localStorage.setItem('token',token);
  
  }
   
  public addUserToLocalCache(user:User):void{
    localStorage.setItem('user',JSON.stringify(user));
    }
 
    public getUserFromLocalCache():User{
      return  JSON.parse( localStorage.getItem('user')); }

//loadfrom localstorage
    public loadToken():void{
        this.token=localStorage.getItem('token'); }


     public getToken():string{
          return this.token; }

     public isLoggedIn():boolean{
       this.loadToken();
       if (this.token != null && this.token !==''){
         //.sub (subject) return  nom user 
             if(this.jwtHelper.decodeToken(this.token).sub != null || ''){
               if ( !this.jwtHelper.isTokenExpired(this.token)){
                  this.loggedInUsername= this.jwtHelper.decodeToken(this.token).sub;
                  return true;
                }}
       }else{
         this.logOut();
         return false;}
       }
     
      
            

    
          
        

   
   
 
 
 /* seConnecter(credentials){
    return this.http.post(this.host+"/users/search/byLogin?mc=nesrine1996&/search/bypassword?mc=12ness",credentials)
  } */
}
