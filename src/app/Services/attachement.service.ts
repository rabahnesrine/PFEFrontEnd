import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attachement } from '../models/Attachement';

@Injectable({
  providedIn: 'root'
})
export class AttachementService {
  private host=environment.apiUrl;

  constructor(private http: HttpClient) { }

  
  public pushFileToStorage(file: File ): Observable<HttpEvent<{}>> {
  
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', `${this.host}/attachement/upload`, formdata, {
      reportProgress: true,
      responseType: 'text'     
    });
    return this.http.request(req);
  }
 
  public saveAttachement(attachement:Attachement):Observable<Attachement|HttpErrorResponse>{
   
    return this.http.post<Attachement>(`${this.host}/attachement/add`,attachement);
   
  }

  public getAllAttachement():Observable<Attachement[]|HttpErrorResponse> {
   
    return this.http.get<Attachement[]>(`${this.host}/attachement/all`);
  }


  public deleteAttachement(idAttachement:number) {
    return this.http.delete(`${this.host}/attachement/delete/${idAttachement}`);
  }



 public getFiles(): Observable<any> {
    return this.http.get<any>(`${this.host}/attachement/getallfiles`);
  }


  
public getAttachementByTache(idTask:number):Observable<Attachement[]|HttpErrorResponse> {
 
  return this.http.get<Attachement[]>(`${this.host}/attachement/task/${idTask}`);
}



}
