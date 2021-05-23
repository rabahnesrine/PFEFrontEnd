import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import {environment} from '../../environments/environment'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { CustomHttpResponse } from '../models/custom-http-response';
import { AuthServService } from './auth-serv.service';


@Injectable({
  providedIn: 'root'
})
export class UserServService {
  private host=environment.apiUrl;
  users:User[]=[];



  constructor(private http : HttpClient,private authServ:AuthServService) { }



 

  public getUsers():Observable<User[] |HttpErrorResponse>{
    return this.http.get<User[]>(`${this.host}/user/list`);
  }


 /* public getImg(username: string):Observable<User[] |HttpErrorResponse>{
    return this.http.get<User[]>(`${this.host}/user/image/profile/${username}`);
  }
*/

 
  public addUser(formData: FormData):Observable<User|HttpErrorResponse>{
    return this.http.post<User>(`${this.host}/user/add`,formData);
  }

  public updateUser(formData: FormData):Observable<User|HttpErrorResponse>{
       return  this.http.post<User>(`${this.host}/user/update`,formData);
  }


  public updateProfile(formData: FormData):Observable<User|HttpErrorResponse>{
    return  this.http.post<User>(`${this.host}/user/update`,formData);
}

  public resetPassword(email:string):Observable<CustomHttpResponse|HttpErrorResponse>{
    return this.http.get<CustomHttpResponse>(`${this.host}/user/resetPassword/${email}`);
  }

  public updateProfileImage(formData: FormData):Observable<HttpEvent<User>>{
    return this.http.post<User>(`${this.host}/user/updateProfileImage`,formData,
     {reportProgress:true,
      observe:'events'});
  }


  public deleteUser(userId:number):Observable<CustomHttpResponse|HttpErrorResponse>{
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${userId}`)
  }

public addUsersToLocalCache(users:User[]):void{
  localStorage.setItem('users',JSON.stringify(users));
}

public getUsersFromLocalCache():User[]{
  if(localStorage.getItem('users')){
  return  JSON.parse( localStorage.getItem('users')); 
}
 return null ;
}

public createUserFormData(loggedInUsername:string, user:User ,profileImage:File): FormData{  
  const formData= new FormData();
  formData.append('currentNomUser',loggedInUsername);
  formData.append('username',user.username);
  formData.append('email',user.email);
  formData.append('isActive',JSON.stringify(user.isActive));
  formData.append('isNotLocked',JSON.stringify(user.isNotLocked));
  formData.append('telephone',user.telephone);
  formData.append('role',user.role);
  formData.append('professionUser',user.professionUser);

  formData.append('profileImage',profileImage);

return formData;
 }



/*
delete(id){
  return this.httpclient.delete(this.url+id)
}



public getUsers(page:number,size:number){
  return this.httpclient.get(this.host+"/users?page="+page+"&size="+size);
}

public getUsersBykeyword(nn:string,page:number,size:number){

  return this.httpclient.get(this.host+"/users/search/byNomUserPage?nn="+nn+"&page"+page+"&size="+size);
}


 */
}
