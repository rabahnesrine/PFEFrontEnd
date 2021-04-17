import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UserServService {
  public host:string="http://localhost:8080";
  public url:string="http://localhost:8080/users"


  constructor(private httpclient : HttpClient) { }

  public findlist(){
    return this.httpclient.get<Utilisateur[]>(this.url)
  }

delete(id){
  return this.httpclient.delete(this.url+id)
}



public getUsers(page:number,size:number){
  return this.httpclient.get(this.host+"/users?page="+page+"&size="+size);
}

public getUsersBykeyword(nn:string,page:number,size:number){

  return this.httpclient.get(this.host+"/users/search/byNomUserPage?nn="+nn+"&page"+page+"&size="+size);
}












addUserAPI(p) : Observable<any> {

  return this.httpclient.post("http://localhost:8080/users", p);
}




  /* getListeUsers() : Observable<Utilisateur[]> {
    return this.httpclient.get<Utilisateur[]>(this.host);
  } */
}
