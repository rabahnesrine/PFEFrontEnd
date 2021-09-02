import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Document } from '../models/document';
import { AuthServService } from './auth-serv.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private host=environment.apiUrl;
  constructor(private http: HttpClient, private authServ:AuthServService) {
   }
  



  pushFileToStorage(file: File ): Observable<HttpEvent<{}>> {
   
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', `${this.host}/document/upload`, formdata, {
      reportProgress: true,
      responseType: 'text',
    }
    );
    return this.http.request(req);
  }


 

  saveDocument(document:Document):Observable<Document|HttpErrorResponse> {
  
    return this.http.post<Document>( `${this.host}/document/docSave/`, document );
  }
  updateDoc(id:number, doc:Document) {
  
    return this.http.put(`${this.host}/document/docEdit/`+ id , doc);
  }

  docByusername(username:String):Observable<Document[]|HttpErrorResponse> {
  
    return this.http.get<Document[]>(`${this.host}/document/docprive/username/`+username);
  }

  docArchiveByusername(username:String):Observable<Document[]|HttpErrorResponse> {
  
    return this.http.get<Document[]>(`${this.host}/document/docArchive/username/`+username);
  }

  archiveDoc(id:number,doc:Document) {
 
    return this.http.put(`${this.host}/document/archive/` + id ,  doc);
  }
  restoreDoc(id:number,doc:Document) {
      
    return this.http.put(`${this.host}/document/restaurer/` +  id , doc );
  }



  getPublicDocument():Observable<Document[]|HttpErrorResponse> {
   
    return this.http.get<Document[]>(`${this.host}/document/documentsPublic`);
  }

  deleteDocument(idDoc:number) {
    return this.http.delete(`${this.host}/document/deleteDoc/${idDoc}`);
  }

  getDocumentById(idDoc:number): Observable<any> {
 
    return this.http.get(`${this.host}/document/docById/${idDoc}`);
  }

  getFilebyname(fileName) {
   
    const headers = new HttpHeaders();
    return this.http.get(`${this.host}/document/${fileName}`, {
      headers : new HttpHeaders( { 'Authorization' : this.authServ.getToken()}),
      responseType: 'blob',
      observe : 'response',
    });
  }


  getAllDocumentPrivate() {
 
    return this.http.get(`${this.host}/document/prive`);
  }

  getAllArchivedDocument() {
    return this.http.get(`${this.host}/document/archives`);
  }





/* getDocumentByFileName(file)  {
 
  return this.http.get(this.host + '/document/' + file);
} */



//Dashbord part

getTotalDocument() {
 
  return this.http.get(`${this.host}/document/totale` );
}

getTotalArchivedDocument() {
 
  return this.http.get(`${this.host}/document/totaleArchive` );
}
getTotalNonArchiveDocument() {
 
  return this.http.get(`${this.host}/document/totaleNonArchive` );
}

getnbPublicDocument() {
 
  return this.http.get(`${this.host}/document/totalePublic` );
}
getnbPriveDocument() {
 
  return this.http.get(`${this.host}/document/totalePrive` );
}










}
