import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Commentaire } from '../models/Commentaire';
import { Task } from '../models/Task';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private host=environment.apiUrl;

  constructor(private http: HttpClient) {}
 

saveTask(task:Task):Observable<Task|HttpErrorResponse>{
  return this.http.post<Task>(`${this.host}/task/save`,task);
   
}

/* public updateTask(idTask:number,task:Task):Observable<Task|HttpErrorResponse>{
  return this.http.put<Task>(`${this.host}/attachement/update/${idTask}`,task);
} */
public addTasksToLocalCache(tasks:Task[]):void{
  localStorage.setItem('tasks',JSON.stringify(tasks));
}

public getTasksFromLocalCache():Task[]{
  if(localStorage.getItem('tasks')){
  return  JSON.parse( localStorage.getItem('tasks')); 
}
 return null ;
}


public updateTask(idTask:number,task:Task):Observable<Task|HttpErrorResponse>{
  return this.http.put<Task>(`${this.host}/task/update/${task.idTask}`, task);
}


getAllTasks():Observable<Task[]|HttpErrorResponse> {
  return this.http.get<Task[]>(`${this.host}/task/all`);
}

deleteTask(idTask:number) {
  return this.http.delete(`${this.host}/task/delete/${idTask}`);

}

getFile(fileName) {
  const headers = new HttpHeaders();
  return this.http.get(`${this.host}/attachement/${fileName}`, {
    responseType: 'blob',
    observe : 'response',
  });
}
 getTaskById(idTask:number):Observable<Task|HttpErrorResponse>  {
 
  return this.http.get<Task>(`${this.host}/task/findById/${idTask}`);
}

saveComment(comment:Commentaire):Observable<Commentaire|HttpErrorResponse>{
  return this.http.post<Commentaire>(`${this.host}/task/commentSave`,comment);
}

public deleteCommentaire(idCommentaire:number) {
  return this.http.delete(`${this.host}/task/deleteComm/${idCommentaire}`);
}




getCommentByTacheId(id:number):Observable<Commentaire[]|HttpErrorResponse> {
  return this.http.get<Commentaire[]>(`${this.host}/task/comment/${id}`);
}

getTotalTache() {
  return this.http.get(`${this.host}/task/total`);
}

getArchivedTache():Observable<Task[]|HttpErrorResponse> {
  return this.http.get<Task[]>(`${this.host}/task/archives`);
}
archiveTask(idTask:number):Observable<Task|HttpErrorResponse> {
  return this.http.put<Task>(`${this.host}/task/archive`,idTask);
}

restoreTask(idTask:number):Observable<Task|HttpErrorResponse>{
  return this.http.put<Task>(`${this.host}/task/restore`,idTask);
}
getTacheUserProfile(id:number):Observable<User|HttpErrorResponse> {
  return this.http.get<User>(`${this.host}/task/contactChef/${id}`);
 
}
getTacheUserProfileMember(id:number):Observable<User|HttpErrorResponse> {
  return this.http.get<User>(`${this.host}/task/contactMember/${id}`);
}

/* saveNotification(message: string)  {
  return this.notifArray.push(message);
}
 */
getTotalTacheInProgress() {
  return this.http.get(`${this.host}/task/inProgress`);
}

getTotalTacheUnstarted() {
  return this.http.get(`${this.host}/task/unstarted`);
}

getTotalTacheToFinish() {
  return this.http.get(`${this.host}/task/toFinish`);

}

getTotalTacheCancel() {
  return this.http.get(`${this.host}/task/cancel`);

}
getTotalTacheArchive() {
  return this.http.get(`${this.host}/task/totalArchive`);

}
 
}
