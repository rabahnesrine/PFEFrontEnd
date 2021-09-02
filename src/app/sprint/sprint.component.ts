import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from 'node-angular-http-client';
import { timeStamp } from 'node:console';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
import { CustomHttpResponse } from '../models/custom-http-response';
import { Projet } from '../models/Projet';
import { Sprint } from '../models/Sprint';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { AuthServService } from '../Services/auth-serv.service';
import { NotificationService } from '../Services/notification.service';
import { ProjetServService } from '../Services/projet-serv.service';
import { SprintService } from '../Services/sprint.service';
import { TaskService } from '../Services/task.service';
import { UserServService } from '../Services/user-serv.service';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {
  public userActuel: User;
  public chefAffecter:User;
  public projetActuel: Projet=null;
  public nomSprint: string = '';
  public dateFin: Date = null;
  public refreshSprint: boolean;
  public sprints: Sprint[]=[];//for admin all
  public mySprints:Sprint[];//for scrum master
  public sprintsChef:Sprint[];//for chef 
  

  public sprintsSmtest:Sprint[];//sprint Sm de son projet meme si admin cree des sprint et les affecte a un projet Sm 

  public description: string = '';
  public myProjects:Projet[];
  public chefs: User[];
  public editSprint = new Sprint();
  public selectSprintDelete: Sprint;
  public selectedSprint:Sprint;

  public projects:Projet[];
  public sprintsAdd:Sprint[];
  public sprintsUpdate:Sprint[];
  public sprintTeste:Sprint;

  public tasks:Task[];
  public tasksMember:Task[];
  public sprintsMember:Sprint[] = [];
  public lengthtab: number;
  public indexitemTest:number;
  public iduser:number;

  constructor(private authServ: AuthServService,private taskServ:TaskService,private userServ: UserServService,private sprintServ: SprintService ,private projetServ: ProjetServService, private notificationService: NotificationService, private router: Router) {
   }

  ngOnInit(): void {
 this.getSprints(false);
    this.userActuel = this.authServ.getUserFromLocalCache();
    console.log("sprint cree par "+this.userActuel.username);
    //this.projects=this.projetServ.getProjetsFromLocalCache();
    if(this.userActuel.role=="ROLE_SCRUM_MASTER") {
      this.myProjects = this.projetServ.getProjetsFromLocalCache().filter(p => p.creePar.id==this.userActuel.id);
    }else {
      this.myProjects = this.projetServ.getProjetsFromLocalCache();
    }

   //   console.log(this.sprints);

console.log(this.myProjects);
this.chefs=this.userServ.getUsersFromLocalCache().filter(u=>u.role=="ROLE_CHEF");
console.log(this.chefs);

//this.sprintMember();
this.getSprintMember()

  }



  detailSprints(sprint) {
    console.log(sprint.idSprint);
  // this.router.navigateByUrl('/projet', sprint.projet.idProjet);
   this.router.navigate(['/tasks', sprint.idSprint]);

  }


  public getSprints(showNotification: boolean): void {
    this.refreshSprint = true;
    this.sprintServ.getSprints().subscribe(
      (response: Sprint[]) => {

        console.log(response);
        this.sprintServ.addSprintsToLocalCache(response);
        this.sprints = response;
        this.refreshSprint = false;

        this.getMySprints()

        if (showNotification) {
          this.sendNotification(NotificationType.SUCCESS, `${response.length} sprint(s) loaded successfully . `);
        }
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.refreshSprint = false;
      }
    )
    
    document.getElementById("refreshsprintButton").click();
  }

/* public sprintMember():void{
  
// a voir  if currentUser == member
if (this.userActuel.role=='ROLE_MEMBER'){
  this.tasks=this.taskServ.getTasksFromLocalCache();
  this.tasksMember=this.tasks.filter(t=>t.memberAffecter.id==this.userActuel.id);
  this.tasksMember.forEach(e=>{
    this.sprintsMember.push(e.sprint) 
  });
  
  }
} */


public getSprintMember(): void {
  console.log("getsprintMember")
this.iduser=this.userActuel.id;
  this.sprintServ.getSprintMember(this.userActuel.id).subscribe(
    (response: Sprint[]) => {
console.log("resp")
      console.log(response);
      this.sprintsMember = response;
      this.refreshSprint = false;


    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      this.refreshSprint = false;
    }
  );

}




  public getMySprints(): void {
    this.refreshSprint = true;
   /*  this.mySprints = this.sprints.filter(p => p.sprintCreePar.id==this.userActuel.id);
    //console.log("sprintbyprojetSm")
    this.sprintsSmtest=this.sprints.filter(s=>s.projet.creePar.id==this.userActuel.id)
    //console.log(this.sprintsSmtest);
    this.sprintsChef= this.sprints.filter(sprint=>sprint.chefAffecter.id==this.userActuel.id);
  // console.log(this.projets.find(p => p.creePar.username=="med"));
//console.log(this.mySprints); */


if(this.userActuel.role=="ROLE_ADMIN"){
  this.sprints=this.sprintServ.getSprintsFromLocalCache();
             }else if (this.userActuel.role=="ROLE_SCRUM_MASTER"){
    this.sprints=this.sprints.filter(s=>s.projet.creePar.id==this.userActuel.id)
}else if (this.userActuel.role=="ROLE_CHEF"){
  this.sprints= this.sprints.filter(sprint=>sprint.chefAffecter.id==this.userActuel.id);
} else{this.getSprintMember();}
  }


  public onAddNewSprint(newSprintForm: Sprint): void {
  
  console.log(this.sprintsAdd = this.sprints.filter(s => s.projet.idProjet==this.projetActuel.idProjet));//tous les sprint qui on le idProject actuel(important)
 
   if (!(this.sprintsAdd.find(s=>s.nomSprint==newSprintForm.nomSprint))) {
    this.sprintServ.addSprint(newSprintForm).subscribe((response: Sprint) => {
            this.clickButton('new-sprint-close');
            this.getSprints(false); // false pour n'est pas affiche le message pop
            console.log("added fonction ")
            this.nomSprint = '';
            this.dateFin = null;
            this.sendNotification(NotificationType.SUCCESS, `${response.nomSprint} added successfully . `);
    
          },
            (errorResponse: HttpErrorResponse) => {
              console.log(errorResponse);
              this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
              this.getSprints(false); 
    
            }
          )
        } else {
          this.sendNotification(NotificationType.ERROR, "Erreur sprint name "+newSprintForm.nomSprint+" existed  into project "+newSprintForm.projet.nameProjet);
          this.getSprints(false);

        }
 
  }


  public onEditSprint(editSprint: Sprint): void {
    this.editSprint = editSprint;
    console.log("edit  " + editSprint.nomSprint);
    // this.currentUsername= editUser.username;
    this.clickButton('openSprintEdit');
  }



  public onUpdateSprint(): void {
    console.log(this.sprintsUpdate = this.sprints.filter(s => s.projet.idProjet==this.editSprint.projet.idProjet));//tous les sprint qui on le idProject actuel(important)
    if ((this.sprintsUpdate.filter(s=>s.nomSprint==this.editSprint.nomSprint)).length===1) {

      this.sprintServ.updateSprint(this.editSprint.idSprint,this.editSprint).subscribe(
        (response: Sprint) => {
          console.log(response);

          this.clickButton('edit-sprint-close');
          this.getSprints(false);
          this.sendNotification(NotificationType.SUCCESS, `${response.nomSprint} updated successfully . `);

        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.getSprints(false); 
        }
      )
    } else {
      this.sendNotification(NotificationType.ERROR, "Erreur sprint name "+this.editSprint.nomSprint+" existed  into project "+this.editSprint.projet.nameProjet);
      this.clickButton('edit-sprint-close');
      this.getSprints(false);
    }



  }

  public onSelectSprint(selectedSprint: Sprint): void {
    this.selectedSprint = selectedSprint;
    console.log(this.selectedSprint)
    document.getElementById('openSprintInfo').click();

  }



  public onDeleteSprint(id: number): void {
    console.log(this.sprints.find(s => s.idSprint == id)
    );

    this.selectSprintDelete = this.sprints.find(s => s.idSprint == id);
    console.log(this.selectSprintDelete.sprintCreePar.id);
    console.log(this.userActuel.id)




    if (this.selectSprintDelete.sprintCreePar.id == this.userActuel.id) {
      console.log("egaux");
    }
    else { console.log("non "); }


    if (this.userActuel.role == "ROLE_ADMIN" || this.selectSprintDelete.sprintCreePar.id == this.userActuel.id) {
      this.sprintServ.deleteSprint(id).subscribe(
        (response: CustomHttpResponse) => {
          console.log(response);
          this.sendNotification(NotificationType.SUCCESS, "success deleting");

          this.getSprints(false);
        }, (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }

      )
    } else {
      this.sendNotification(NotificationType.ERROR, "you don't have permission ");
      this.getSprints(false);
    }

  }





  public saveNewSprint(): void {
    this.clickButton('new-sprint-save');
    this.clickButton('new-sprint-close');

    console.log("usersave fonction ");


  }




  public searchSprints(searchSprint: string): void {
    console.log(searchSprint);
    const results: Sprint[] = [];
    for (const sprint of this.sprints) {
      console.log(sprint);
      console.log("test3" + sprint.nomSprint)
      if (sprint.nomSprint.toLowerCase().indexOf(searchSprint.toLowerCase()) !== -1 ||
      sprint.projet.nameProjet.toLowerCase().indexOf(searchSprint.toLowerCase()) !== -1 ||
        sprint.sprintCreePar.username.toLowerCase().indexOf(searchSprint.toLowerCase()) !== -1 ||
        sprint.chefAffecter.username.toLowerCase().indexOf(searchSprint.toLowerCase()) !== -1) {
        results.push(sprint);
        console.log(results);
        this.sprints = results;
        console.log(this.sprints);
      }
    }
    this.sprints = results;

    if (results.length === 0 || !searchSprint) {
      this.getSprints(false);
      /*  if(this.userActuel.role=="ROLE_ADMIN"){
        this.sprints = this.sprintServ.getSprintsFromLocalCache();}
        else if (this.userActuel.role=="ROLE_SCRUM_MASTER"){
        this.sprints=this.sprints.filter(s=>s.projet.creePar.id==this.userActuel.id)}
       else if (this.userActuel.role=="ROLE_CHEF"){
         this.sprints= this.sprints.filter(sprint=>sprint.chefAffecter.id==this.userActuel.id);}
        else { this.getSprintMember()}  */
 
      // document.getElementById("refreshProjButton").click();
      console.log("err")
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
  public get isMemberOnly():boolean{
    return this.getUserRole()===Role.MEMBER;
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



}
