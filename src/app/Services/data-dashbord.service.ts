import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sprint } from '../models/Sprint';

@Injectable({
  providedIn: 'root'
})
export class DataDashbordService {
  private host=environment.apiUrl;
  username:string="ness";

  constructor(private http: HttpClient) { }












//projet
getTotalProjet() {
  
  return this.http.get(this.host + '/projet/totalProjet' );
}

getTotalProjetPaused() {
  
  return this.http.get(this.host + '/projet/paused' );
}
getTotalProjetSuspended() {
  
  return this.http.get(this.host + '/projet/suspended' );
}
getTotalProjetCompleted() {
  
  return this.http.get(this.host + '/projet/Completed' );
}
getTotalProjetActive() {
  
  return this.http.get(this.host + '/projet/active' );
}


//sprint
getTotalSprint() {
  
  return this.http.get(this.host + '/sprint/totalSprint' );
}

getTotalSprintDevelopment() {
  
  return this.http.get(this.host + '/sprint/development' );
}
getTotalSprintDelivery() {
  
  return this.http.get(this.host + '/sprint/delivery' );
}
getTotalSprintPaused() {
  
  return this.http.get(this.host + '/sprint/paused' );
}getTotalSprintTesting() {
  
  return this.http.get(this.host + '/sprint/testing' );
}

//tache
  getTotalTacheInProgress() {
  
    return this.http.get(this.host + '/task/inProgress' );
  }
  
  getTotalTacheUnstarted() {
   
    return this.http.get(this.host + '/task/unstarted' );
  }
  
  getTotalTacheToFinish() {
   
    return this.http.get(this.host + '/task/toFinish' );
  }
  
  getTotalTacheCancel() {
   
    return this.http.get(this.host + '/task/cancel' );
  }
 
  
  getTotalTache() {
   
    return this.http.get(this.host + '/task/total' );
  
  }
  getTotalTacheArchived() {
   
    return this.http.get(this.host + '/task/totalArchive' );
  
  }

  getTotalTacheByUsername() {
    
     return this.http.get(this.host + '/task/totalByChef/' + this.username);
  }

  getTotalTacheBySprint(idsprint:number) {
    
    return this.http.get(this.host + '/task/totalBySprint/' + idsprint);
 }
 getTotalSprintByProjet(idProjet:number) {
    
  return this.http.get(this.host + '/sprint/totalByProjet/' + idProjet);
}


getSprintByProjetId(id:number):Observable<Sprint[]> {
  return this.http.get<Sprint[]>(`${this.host}/sprint/projetSprint/${id}`);
} 

getnbTaskByProjetId(id:number) {
  return this.http.get(`${this.host}/task/totalSprintByProjet/${id}`);
}

getnbTaskCompletedByProjetId(id:number) {
  return this.http.get(`${this.host}/task/totalCompletedByProjet/${id}`);
}

}
