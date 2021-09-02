import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Projet } from '../models/Projet';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomHttpResponse } from '../models/custom-http-response';
import { Sprint } from '../models/Sprint';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class SprintService {
  private host=environment.apiUrl;

  constructor(private http : HttpClient) { }

  public getSprints():Observable<Sprint[]|HttpErrorResponse>{
    return this.http.get<Sprint[]> (`${this.host}/sprint/all`);
  }

  public getSprintMember(id:number):Observable<Sprint[]|HttpErrorResponse>{
    return this.http.get<Sprint[]|HttpErrorResponse>(`${this.host}/sprint/sprintBytaskMember/${id}`)
  }

  public addSprint(sprint:Sprint):Observable<Sprint|HttpErrorResponse>{
    return this.http.post<Sprint>(`${this.host}/sprint/add`,sprint);
  }

  public updateSprint(idSprint:number,sprint:Sprint):Observable<Sprint|HttpErrorResponse>{
    return this.http.put<Sprint>(`${this.host}/sprint/update/${idSprint}`,sprint);
  }
 
  public deleteSprint(idSprint:number):Observable<CustomHttpResponse|HttpErrorResponse>{
    return this.http.delete<CustomHttpResponse>(`${this.host}/sprint/delete/${idSprint}`)
  }


  public addSprintsToLocalCache(sprints:Sprint[]):void{
    localStorage.setItem('sprints',JSON.stringify(sprints));
  }
  
  public getSprintsFromLocalCache():Sprint[]{
    if(localStorage.getItem('sprints')){
    return  JSON.parse( localStorage.getItem('sprints')); 
  }
   return null ;
  }
}
