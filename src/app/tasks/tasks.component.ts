import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,ParamMap } from '@angular/router';
import { HttpErrorResponse } from 'node-angular-http-client';
import { HttpEventType,HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
import { Attachement } from '../models/Attachement';
import { Commentaire } from '../models/Commentaire';
import { CustomHttpResponse } from '../models/custom-http-response';
import { Sprint } from '../models/Sprint';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { AttachementService } from '../Services/attachement.service';
import { AuthServService } from '../Services/auth-serv.service';
import { NotificationService } from '../Services/notification.service';
import { SprintService } from '../Services/sprint.service';
import { TaskService } from '../Services/task.service';
import { UserServService } from '../Services/user-serv.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  public members: User[];
  public userActuel: User;
  public sprints:Sprint[];
  public refreshTask: boolean;
  public tasks:Task[];
  public tasksAdd:Task[];
  public sprintActuel: Sprint=null;
  public nameTask: string = '';
  public dateFin: Date = null;
  public memberAffecter:User;
  public description: string = '';
  public myTasks:Task[];
  public mySprints: Sprint[];
  public tasksMember:Task[];
  public tasksBySprint:Task[];
  public TasksInProgress:Task[];
  public TasksCancel:Task[];
  public TasksInFinish:Task[];
  public TasksToDo:Task[];

public editTask = new Task();
  public TasksUpdate:Task[];
  public selectTaskDelete: Task;
  public selectedTask:Task;

 public idSprint:number;



//cmt
 public commentaire: Commentaire = new Commentaire();
public submited = false;
 public messageTask: string;
public id: number;
public commentTask:any;
public messageComment: string;
//attach
progress: { percentage: number } = { percentage: 0 };
  fileUploads:  Observable<string[]>;
  selectedFiles: FileList;
  currentFileUpload: File;
  allAttachement: any;
  attachementTache: any;
  attachement: Attachement =  new Attachement();




  constructor( private router: Router, private taskServ:TaskService, private activateRoute: ActivatedRoute,private attachementService:AttachementService ,private authServ: AuthServService,private userServ: UserServService,private sprintServ: SprintService , private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getTasks(false);
    this.userActuel = this.authServ.getUserFromLocalCache();
console.log("task cree par"+this.userActuel.username);
    this.members=this.userServ.getUsersFromLocalCache().filter(u=>u.role=="ROLE_MEMBER");
console.log(this.members);
//recupere sprint id
this.activateRoute.paramMap.subscribe((params:ParamMap)=>
{console.log(params);
let sprint =parseInt(params.get('idSprint'));

  //let id1 =parseInt(params.get('idSprint'));
this.idSprint = sprint;
console.log(this.idSprint);

console.log(params);});

if(this.userActuel.role=="ROLE_CHEF"){
this.sprints=this.sprintServ.getSprintsFromLocalCache().filter(sprint => sprint.chefAffecter.id==this.userActuel.id).filter(sprint=>sprint.idSprint==this.idSprint);//si Useractuel et le chef Chef
}else if(this.userActuel.role=="ROLE_SCRUM_MASTER") {
this.sprints=this.sprintServ.getSprintsFromLocalCache().filter(sprint => sprint.sprintCreePar.id==this.userActuel.id).filter(sprint=>sprint.idSprint==this.idSprint);//si Useractuel et le cree Par 
  }else {
    this.sprints=this.sprintServ.getSprintsFromLocalCache().filter(sprint=>sprint.idSprint==this.idSprint);
  }
console.log(this.sprints);

//console.log(this.getTasks(false));
    
 
//this.commentTacheByID();
    
 
  }

  public getTasks(showNotification: boolean): void {
    this.refreshTask = true;
    this.taskServ.getAllTasks().subscribe(
      (response: Task[]) => {

        console.log(response);
        this.taskServ.addTasksToLocalCache(response);
        this.tasks = response;
        this.tasksBySprint=this.tasks.filter(t=>t.sprint.idSprint==this.idSprint);
        this.TasksCancel=this.tasksBySprint.filter(t=>t.etatTask=="TASKETAT_CANCEL");  
        this.TasksInFinish=this.tasksBySprint.filter(t=>t.etatTask=="TASKETAT_TOFINISH");
        this.TasksInProgress=this.tasksBySprint.filter(t=>t.etatTask=="TASKETAT_INPROGRESS");
        this.TasksToDo=this.tasksBySprint.filter(t=>t.etatTask=="TASKETAT_UNSTARTED");
        console.log(this.tasksBySprint);
        this.refreshTask = false;

       // this.getMyTasks()

        if (showNotification) {
          this.sendNotification(NotificationType.SUCCESS, `${response.length} task(s) loaded successfully . `);
        }
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.refreshTask = false;
      }
    )
    
    document.getElementById("refreshtaskButton").click();
  }




/*   public getMyTasks(): void {
    this.refreshTask = true;
    this.myTasks = this.tasks.filter(p => p.taskCreePar.id==this.userActuel.id);
    this.tasksMember= this.tasks.filter(t=>t.memberAffecter.id==this.userActuel.id);
  // console.log(this.projets.find(p => p.creePar.username=="med"));
console.log(this.myTasks);
    
  } */
  
  public onAddNewTask(newTaskForm: Task): void {
  
    console.log(this.tasksAdd = this.tasks.filter(s => s.sprint.idSprint==this.sprintActuel.idSprint));//tous les sprint qui on le idProject actuel(important)
   
     if (!(this.tasksAdd.find(s=>s.nameTask==newTaskForm.nameTask))) {
      this.taskServ.saveTask(newTaskForm).subscribe((response: Task) => {
              this.clickButton('new-task-close');
              this.getTasks(false); // false pour n'est pas affiche le message pop
              console.log("added fonction ")
              this.nameTask = '';
              this.dateFin = null;
              this.sendNotification(NotificationType.SUCCESS, `${response.nameTask} added successfully . `);
      
            },
              (errorResponse: HttpErrorResponse) => {
                console.log(errorResponse);
                this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
                this.getTasks(false); 
      
              }
            )
          } else {
            this.sendNotification(NotificationType.ERROR, "Erreur tasks name "+newTaskForm.nameTask+" existed  into sprint "+newTaskForm.sprint.nomSprint);
            this.getTasks(false);
  
          }
   
    } 
    
    public onSelectTask(selectedTask: Task): void {
      this.selectedTask = selectedTask;
      console.log(this.selectedTask)
      this.commentTacheByID();
      this.getAttachementByTacheID()

      document.getElementById('openTaskInfo').click();
  
    }
  
  


    public onEditTask(editTask: Task): void {
      this.editTask = editTask;
      console.log("edit  " + editTask.nameTask);
      // this.currentUsername= editUser.username;
      this.clickButton('openTaskEdit');
    }
  
  
  
    public onUpdateTask(): void {
   
  console.log( this.editTask.memberAffecter.id == this.userActuel.id)
 if (this.userActuel.role == "ROLE_ADMIN"|| this.userActuel.role == "ROLE_SCRUM_MASTER" ||this.userActuel.role == "ROLE_CHEF"|| this.editTask.memberAffecter.id == this.userActuel.id){
      if ((this.tasksBySprint.filter(t=>t.nameTask==this.editTask.nameTask)).length===1) { 
       this.taskServ.updateTask(this.editTask.idTask,this.editTask).subscribe(
         (response: Task) => {
            console.log(response);
            this.getTasks(false);
            this.clickButton('edit-task-close');
            this.sendNotification(NotificationType.SUCCESS, `${response.nameTask} updated successfully.`);


          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message );
            this.getTasks(false); 
          }
        )
      } else {
        this.sendNotification(NotificationType.ERROR, "Erreur task name "+this.editTask.nameTask+" existed  into sprint "+this.editTask.sprint.nomSprint);
        this.clickButton('edit-task-close');
        this.getTasks(false);
      }
    }else {
      this.sendNotification(NotificationType.ERROR, "you don't have permission ");
      this.getTasks(false);
    }
  
    }
  



    public onDeleteTask(id: number): void {
      console.log(this.tasks.find(t => t.idTask == id));
  
      this.selectTaskDelete = this.tasks.find(t => t.idTask == id);
      console.log(this.selectTaskDelete.taskCreePar.id);
      console.log(this.userActuel.id)
  
  
      if (this.selectTaskDelete.taskCreePar.id == this.userActuel.id) {
        console.log("egaux");
      }
      else { console.log("non "); }
  
  
      if (this.userActuel.role == "ROLE_ADMIN"|| this.userActuel.role == "ROLE_SCRUM_MASTER" || this.selectTaskDelete.taskCreePar.id == this.userActuel.id) {
        this.taskServ.deleteTask(id).subscribe(
          (response: CustomHttpResponse) => {
            console.log(response);
            this.sendNotification(NotificationType.SUCCESS, "success deleting");
  
            this.getTasks(false);
          }, (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  
          }
  
        )
      } else {
        this.sendNotification(NotificationType.ERROR, "you don't have permission ");
        this.getTasks(false);
      }
  
    }
  
  
  



    
    public saveNewTask(): void {
      this.clickButton('new-task-save');
      this.clickButton('new-task-close');
  
      console.log("tasksave fonction ");
    
    }

//commentaire


commentTacheByID() {
  this.taskServ.getCommentByTacheId(this.selectedTask.idTask).subscribe(data => {
    this.commentTask = data;
    console.log(this.commentTask)
  });
}


addNewComment(valid) {
  this.commentaire.tacheCom = this.selectedTask;
  this.taskServ.saveComment(this.commentaire).subscribe( data => {
    console.log(data);
   this.submited = true;
  this.commentTacheByID();
   this.messageComment = 'Laissez un autre commentaire ...';
  }, err => {
    console.log(err);
  });
  this.commentaire = new Commentaire();
}

public onDeleteComment(id: number): void {
 // console.log(this.tasks.find(t => t.idTask == id));

 /*  this.selectTaskDelete = this.tasks.find(t => t.idTask == id);
  console.log(this.selectTaskDelete.taskCreePar.id);
  console.log(this.userActuel.id)


  if (this.selectTaskDelete.taskCreePar.id == this.userActuel.id) {
    console.log("egaux");
  }
  else { console.log("non "); } */


  //if (this.userActuel.role == "ROLE_ADMIN"|| this.userActuel.role == "ROLE_SCRUM_MASTER" || this.selectTaskDelete.taskCreePar.id == this.userActuel.id) {
    this.taskServ.deleteCommentaire(id).subscribe(
      (response: CustomHttpResponse) => {
        console.log(response);
        this.sendNotification(NotificationType.SUCCESS, "success deleting");
        this.commentTacheByID();
        
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

      }

    )
  /* } else {
    this.sendNotification(NotificationType.ERROR, "you don't have permission ");
    this.getTasks(false);
  } */

}


//attachement 

upload() {
  this.progress.percentage = 0;

  this.currentFileUpload = this.selectedFiles.item(0);
  this.attachementService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
    if (event.type === HttpEventType.UploadProgress) {
      this.progress.percentage = Math.round(100 * event.loaded / event.total);
    } else if (event instanceof HttpResponse) {
      console.log('File is completely uploaded!');
      this.getAllAttachement();

    }
  });

  this.selectedFiles = undefined;
}
selectFile(event) {
  this.selectedFiles = event.target.files;
}
getAllAttachement() {
  this.attachementService.getAllAttachement().subscribe( data => {
    this.allAttachement = data;
    console.log(data);
  }, err => {
    console.log(err);
  });
}
getAttachementByTacheID() {
  this.attachementService.getAttachementByTache(this.selectedTask.idTask).subscribe(data => {
    this.attachementTache = data;
    console.log(this.attachementTache);
  });
}
saveAttachement() {
 
  this.attachement.taskAtt =  this.selectedTask;
  console.log(this.attachement.taskAtt.idTask)
  this.attachementService.saveAttachement(this.attachement).subscribe(data => {
    this.getAttachementByTacheID();
     console.log(this.getAttachementByTacheID());
    console.log(data);
  }, err => {
    console.log(err);
  });
  this.attachement = new Attachement();
}

onDeleteAttachement(att) {
  console.log(att)
console.log(att.idAttachement);
  this.attachementService.deleteAttachement(att.idAttachement).subscribe(
    (response: CustomHttpResponse) => {
      console.log(response);
      this.sendNotification(NotificationType.SUCCESS, "success deleting");

      this.getAttachementByTacheID();
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

    }

  )

}
 downloadFileToSave(attachement) {
  this.taskServ.getFile(attachement.file).subscribe(res => {
    this.saveToFileSystem(res);
  });
} 
 private saveToFileSystem(response) {
  console.log('file download response:', response);
  console.log(response)
  const contentDispositionHeader: string = response.headers.get('Content-Disposition');
  console.log(contentDispositionHeader);
  const parts: string[] = contentDispositionHeader.split(';');
  const filename = parts[1].split('=')[1];
  const blob = new Blob([response['body']], { type: response.headers.get('Content-Type') });
  /*   const url = window.URL.createObjectURL(blob);
    window.open(url); */
  saveAs(blob, filename);
}











    private clickButton(buttonId: string): void {
      document.getElementById(buttonId).click();
    }
  
    private sendNotification(notificationType: NotificationType, message: string): void {
      if (message) {
        this.notificationService.notify(notificationType, message);
  
      } else {
        this.notificationService.notify(notificationType, 'An error occured . Please try again.')
      }
    }

//get role 
private getUserRole():string{
  return this.authServ.getUserFromLocalCache().role;
}

public get isAdmin():boolean{
  return this.getUserRole()=== Role.ADMIN;
}

public get isScrumMaster():boolean{
  return this.isAdmin ||this.getUserRole()=== Role.SCRUM_MASTER;
}

public get isChef():boolean{
  return this.isAdmin ||this.isScrumMaster|| this.getUserRole()==Role.CHEF;
}

public get isMember():boolean{
  return this.isAdmin ||this.isScrumMaster||this.isChef|| this.getUserRole()==Role.MEMBER;
}

public get isAdminOrScrumMaster():boolean{
  return this.isAdmin ||this.isScrumMaster;}

  public get isAdminOrScrumMasterOrChef():boolean{
    return this.isAdmin ||this.isScrumMaster||this.isChef;
  }
  

  public get isScrumMasterOnly():boolean{
    return this.getUserRole()===Role.SCRUM_MASTER;
  }

  public get isChefOnly():boolean{
    return this.getUserRole()===Role.CHEF;
  }


}
