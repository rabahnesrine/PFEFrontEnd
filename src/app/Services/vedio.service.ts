import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Video } from '../models/vedio';

@Injectable({
  providedIn: 'root'
})
export class VedioService {
  private host=environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveVedio(vedio:Video):Observable<Video|HttpErrorResponse> {
  
    return this.http.post<Video>( `${this.host}/video/vedioSave/`, vedio );
  }

  
  pushFileToStorage(file: File ): Observable<HttpEvent<{}>> {
   
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', `${this.host}/video/upload`, formdata, {
      reportProgress: true,
      responseType: 'text',
    }
    );
    return this.http.request(req);
  }


  getAllVedio():Observable<Video[]|HttpErrorResponse>{
    return this.http.get<Video[]>(`${this.host}/video/getALLVedio`)
  }


  getvediofromPath(file:string):Observable<File>{
    return this.http.get<File>(`${this.host}/video/vedioshow/`+file);

  }


  getvediobyname(file:string):Observable<File>{
    return this.http.get<File>(`${this.host}/video/vediosh/${file}`);

  }









 
  public addVedio(formData: FormData):Observable<Video|HttpErrorResponse>{
    return this.http.post<Video>(`${this.host}/vedio/add`,formData);
  }
  
public createVedioFormData(vedio:Video ,file:File): FormData{  
  const formData= new FormData();
  formData.append('nomVedio',vedio.nomVedio);
  formData.append('authorisation',vedio.authorisation);
  formData.append('description',vedio.description);
  formData.append('file',file);

return formData;
 }

}
