import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServService {
link="http://localhost:8080/users";

  constructor(private httpclient:HttpClient) { }

  seConnecter(credentials){
    return this.httpclient.post(this.link+"/users/search/byLogin?mc=nesrine1996&/search/bypassword?mc=12ness",credentials)
  }
}
