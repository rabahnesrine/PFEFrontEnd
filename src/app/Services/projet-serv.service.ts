import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Projet } from '../models/Projet';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import {environment} from '../../environments/environment'
import { CustomHttpResponse } from '../models/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class ProjetServService {
  private host=environment.apiUrl;

  constructor(private http : HttpClient) { }

  public getProjets():Observable<Projet[]|HttpErrorResponse>{
    return this.http.get<Projet[]> (`${this.host}/projet/allProjets`);
  }

  public addProjet(projet:Projet):Observable<Projet|HttpErrorResponse>{
    return this.http.post<Projet>(`${this.host}/projet/add`,projet);
  }

  public updateProjet(idProjet:number,projet:Projet):Observable<Projet|HttpErrorResponse>{
    return this.http.put<Projet>(`${this.host}/projet/update/${idProjet}`,projet);
  }
 
  public deleteProjet(idProjet:number):Observable<CustomHttpResponse|HttpErrorResponse>{
    return this.http.delete<CustomHttpResponse>(`${this.host}/projet/delete/${idProjet}`)
  }


  public addProjetsToLocalCache(projets:Projet[]):void{
    localStorage.setItem('projets',JSON.stringify(projets));
  }
  
  public getProjetsFromLocalCache():Projet[]{
    if(localStorage.getItem('projets')){
    return  JSON.parse( localStorage.getItem('projets')); 
  }
   return null ;
  }

  
 
 /* public addUser(formData: FormData):Observable<User|HttpErrorResponse>{
    return this.http.post<User>(`${this.host}/user/add`,formData);
  }

  public updateUser(formData: FormData):Observable<User|HttpErrorResponse>{
       return  this.http.post<User>(`${this.host}/user/update`,formData);
  }

*/


}
