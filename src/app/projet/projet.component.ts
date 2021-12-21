import { Component, NgModule, OnInit } from '@angular/core';
import { HttpErrorResponse } from 'node-angular-http-client';
import { NotificationType } from '../enum/notification-type.enum';
import { Projet } from '../models/Projet';
import { NotificationService } from '../Services/notification.service';
import { ProjetServService } from '../Services/projet-serv.service';
import { NgForm, NgModelGroup } from '@angular/forms';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { UserServService } from '../Services/user-serv.service';
import { AuthServService } from '../Services/auth-serv.service';
import { CustomHttpResponse } from '../models/custom-http-response';
import { Role } from '../enum/role.enum';
import { DataDashbordService } from '../Services/data-dashbord.service';


@Component({
  selector: 'app-projet',
  templateUrl:'./projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  public projets: Projet[];//Admin
  public myProjets:Projet [];
  public projetsSMall:Projet [];
  public projetsPOwner:Projet [];

  public allProjet:Projet[];


  public userActuel: User;
  public nameProjet: string = '';
  public dateEcheance: Date = null;
  public refreshProjet: boolean;
  public selectedProjet: Projet;
  public selectProjetDelete: Projet;
  public editProjet = new Projet();
public projet:number;
public nbSallProjet:any[]=[];//for SM
public nbSallAdminProjet:any[]=[];//for admin 
public nbSallMyProjet:any[]=[];//my list
public nbSallProjetPOwner:any[]=[];//product



public nbTaskSM:any[]=[];//for SM
public nbTaskAdmin:any[]=[];//for admin 
public nbTaskMyProjet:any[]=[];//my list
public nbTaskProjetPOwner:any[]=[];//product owner
public nbTaskCompSM:any[]=[];//for SM
public nbTaskCompAdmin:any[]=[];//for admin 
public nbTaskCompMyProjet:any[]=[];//my list
public nbTaskCompProjetPOwner:any[]=[];//product owner 

public nbtask:number;
public nbsprint:number;
nbsprintbyprojet:number;
clients:User[];
public client:User;

  constructor(private projetServ: ProjetServService, private dataDashbord:DataDashbordService, private notificationService: NotificationService, private router: Router, private userServ: UserServService, private authServ: AuthServService) { }

  ngOnInit(): void {
    this.getProjets(false);
    this.userActuel = this.authServ.getUserFromLocalCache(); // recupere user actuel 
    console.log("create projet by" + this.authServ.currentUserlogged());

    this.clients=this.userServ.getUsersFromLocalCache().filter(u=>u.role=="ROLE_PRODUCT_OWNER");

  }

  



  public getProjets(showNotification: boolean): void {
    this.refreshProjet = true;
    this.projetServ.getProjets().subscribe(
      (response: Projet[]) => {
        console.log(response);
        this.projetServ.addProjetsToLocalCache(response);
        this.allProjet=this.projetServ.getProjetsFromLocalCache();
        this.projets = response.filter(p=>p.creePar.role=="ROLE_ADMIN");
        this.projetsSMall=response.filter(p=>p.creePar.role=="ROLE_SCRUM_MASTER")
        this.projetsPOwner=response.filter(p=>p.client.role=="ROLE_PRODUCT_OWNER")
        this.myProjets = response.filter(p => p.creePar.id==this.userActuel.id);
         console.log(this.myProjets)
        this.refreshProjet = false;
        this.nbSprintIntoProjet();
        this.nbTaskIntoProjet();


        if (showNotification) {
          this.sendNotification(NotificationType.SUCCESS, `${response.length} projet(s) loaded successfully . `);
        }
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.refreshProjet = false;
      }
    )
    
    document.getElementById("refreshProjButton").click();
  }





 /*  public getMyProjets(): void {
    this.refreshProjet = true;
    this.myProjets = this.projets.filter(p => p.creePar.id==this.userActuel.id);
  // console.log(this.projets.find(p => p.creePar.username=="med"));
console.log(this.myProjets);
    
  } */






  public onSelectProjet(selectedProjet: Projet): void {
    this.selectedProjet = selectedProjet;
    console.log(this.selectedProjet)
    document.getElementById('openProjetInfo').click();

  }





  public onAddNewProjet(projetForm: Projet): void {
    this.userActuel = this.authServ.getUserFromLocalCache();
    console.log(this.userActuel)
    console.log(projetForm);
    if (this.userActuel.role == "ROLE_ADMIN" || this.userActuel.role == "ROLE_SCRUM_MASTER") {

      this.projetServ.addProjet(projetForm).subscribe((response: Projet) => {
        this.clickButton('new-projet-close');
        this.getProjets(false); // false pour n'est pas affiche le message pop
        console.log("added fonction ")
        this.nameProjet = '';
        this.dateEcheance = null;
        this.sendNotification(NotificationType.SUCCESS, `${response.nameProjet} added successfully . `);

      },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      )
    } else {
      this.sendNotification(NotificationType.ERROR, "you don't have permission ");
      this.getProjets(false);

    }

  }


  public onEditProjet(editProjet: Projet): void {
    this.editProjet = editProjet;
    console.log("edit  " + editProjet.nameProjet);
    // this.currentUsername= editUser.username;
    this.clickButton('openProjetEdit');
  }


  public onUpdateProjet(): void {

    if (this.userActuel.role == "ROLE_ADMIN" || this.editProjet.creePar.id == this.userActuel.id) {

      this.projetServ.updateProjet(this.editProjet.idProjet, this.editProjet).subscribe(
        (response: Projet) => {
          console.log("response" + response);
          console.log(response);

          this.clickButton('edit-projet-close');
          this.getProjets(false); // false pour n'est pas affiche le message pop
          this.sendNotification(NotificationType.SUCCESS, `${response.nameProjet} updated successfully . `);

        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.getProjets(false);
        }
      )
    } else {
      this.sendNotification(NotificationType.ERROR, "you don't have permission");
      this.clickButton('edit-projet-close');
      this.getProjets(false);
    }



  }






  public saveNewProjet(): void {
    this.clickButton('new-projet-save');
    this.clickButton('new-projet-close');

    console.log("usersave fonction ");


  }

  public searchProjets(searchProjet: string): void {
    console.log(searchProjet);
    const results: Projet[] = [];
    const resultsSmP: Projet[] = [];
    const resultsMyP: Projet[] = [];
    const resultsPO: Projet[] = [];


    //search projet admin
    for (const projet of this.projets) {
      //console.log(projet);
      //console.log("test2" + projet.nameProjet)
      if (projet.nameProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
        projet.dateCreation.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
        projet.dateEcheance.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
        projet.etatProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
        projet.creePar.username.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1) {
        results.push(projet);
        //console.log(results);
        this.projets = results;
       // console.log(this.projets);


      }

    }
    this.projets = results;
    if (results.length === 0 || !searchProjet) {
      this.projets = this.projetServ.getProjetsFromLocalCache().filter(p=>p.creePar.role=="ROLE_ADMIN");
      //console.log("err")
    }



 //search projet Product owner
 for (const projet of this.projetsPOwner) {
  //console.log(projet);
  //console.log("test2" + projet.nameProjet)
  if (projet.nameProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.dateCreation.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.dateEcheance.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.etatProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.creePar.username.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1) {
    resultsPO.push(projet);
    //console.log(results);
    this.projetsPOwner = resultsPO;
   // console.log(this.projets);


  }

}
this.projetsPOwner = resultsPO;
if (resultsPO.length === 0 || !searchProjet) {
  this.projetsPOwner = this.projetServ.getProjetsFromLocalCache().filter(p=>p.client.role=="ROLE_PRODUCT_OWNER");
  //console.log("err")
}

// liste Projet SM 

for (const projet of this.projetsSMall) {
 // console.log(projet);
  //console.log("test2" + projet.nameProjet)
  if (projet.nameProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.dateCreation.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.dateEcheance.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.etatProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.creePar.username.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1) {
    resultsSmP.push(projet);
    //console.log(resultsSmP);
    this.projetsSMall = resultsSmP;
    //console.log(this.projetsSMall);


  }

}
this.projetsSMall = resultsSmP;
if (resultsSmP.length === 0 || !searchProjet) {
  this.projetsSMall=this.projetServ.getProjetsFromLocalCache().filter(p=>p.creePar.role=="ROLE_SCRUM_MASTER")
  // document.getElementById("refreshProjButton").click();

 // console.log("err")
}
// list myProjet 
for (const projet of this.myProjets) {
 // console.log(projet);
 // console.log("test2" + projet.nameProjet)
  if (projet.nameProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.dateCreation.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.dateEcheance.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.etatProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
    projet.creePar.username.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1) {
      resultsMyP.push(projet);
   // console.log(resultsMyP);
    this.myProjets = resultsMyP;
    //console.log(this.myProjets);


  }

}
this.myProjets = resultsMyP;
if (resultsMyP.length === 0 || !searchProjet) {
  this.myProjets = this.projetServ.getProjetsFromLocalCache().filter(p => p.creePar.id==this.userActuel.id);
  // document.getElementById("refreshProjButton").click();

  //console.log("err")
}


  }



  public onDeleteProjet(id: number): void {
    console.log(this.allProjet.find(p => p.idProjet == id)
    );

    this.selectProjetDelete = this.allProjet.find(p => p.idProjet == id);
    console.log(this.selectProjetDelete.creePar.id);
    console.log(this.userActuel.id)




    if (this.selectProjetDelete.creePar.id == this.userActuel.id) {
      console.log("egaux");
    }
    else { console.log("non "); }


    if (this.userActuel.role == "ROLE_ADMIN" || this.selectProjetDelete.creePar.id == this.userActuel.id) {
      this.projetServ.deleteProjet(id).subscribe(
        (response: CustomHttpResponse) => {
          console.log(response);
          this.sendNotification(NotificationType.SUCCESS, "success deleting");

          this.getProjets(false);
        }, (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }

      )
    } else {
      this.sendNotification(NotificationType.ERROR, "you don't have permission this is not your project  ");
      this.getProjets(false);
    }

  }



  public nbSprintIntoProjet(){
  
    for (let i = 0; i < this.projetsSMall.length; i++) {
      //console.log(i);
   //   console.log(this.projetsSMall[i]);
      this.dataDashbord.getTotalSprintByProjet(this.projetsSMall[i].idProjet).subscribe((data:number) => {
        this.nbsprint = data;
        this.nbSallProjet.push(this.nbsprint);
  
      })
  
    }
  
    for (let i = 0; i < this.projets.length; i++) {
     // console.log(i);
     // console.log(this.projets[i]);
      this.dataDashbord.getTotalSprintByProjet(this.projets[i].idProjet).subscribe((data:number) => {
        this.nbsprint = data;
        this.nbSallAdminProjet.push(this.nbsprint);
  
      })
  
    }
  
  
    for (let i = 0; i < this.myProjets.length; i++) {
     // console.log(i);
      //console.log(this.myProjets[i]);
      this.dataDashbord.getTotalSprintByProjet(this.myProjets[i].idProjet).subscribe((data:number) => {
        this.nbsprint = data;
        this.nbSallMyProjet.push(this.nbsprint);
  
      })
  
    }

    for (let i = 0; i < this.projetsPOwner.length; i++) {
      // console.log(i);
       //console.log(this.myProjets[i]);
       this.dataDashbord.getTotalSprintByProjet(this.projetsPOwner[i].idProjet).subscribe((data:number) => {
         this.nbsprint = data;
         this.nbSallProjetPOwner.push(this.nbsprint);
   
       })
   
     }
  //  console.log(this.nbSallProjet);
  }
  
  public nbTaskIntoProjet(){
  
    for (let i = 0; i < this.projetsSMall.length; i++) {
     // console.log(i);
     // console.log(this.projetsSMall[i]);
      this.dataDashbord.getnbTaskByProjetId(this.projetsSMall[i].idProjet).subscribe((data:number) => {
        this.nbtask = data;
        this.nbTaskSM.push(this.nbtask); })

        this.dataDashbord.getnbTaskCompletedByProjetId(this.projetsSMall[i].idProjet).subscribe((data:number) => {
          this.nbtask = data;
          this.nbTaskCompSM.push(this.nbtask); })
  
    }
  
    for (let i = 0; i < this.projets.length; i++) {
     // console.log(i);
     // console.log(this.projets[i]);
      this.dataDashbord.getnbTaskByProjetId(this.projets[i].idProjet).subscribe((data:number) => {
        this.nbtask = data;
        this.nbTaskAdmin.push(this.nbtask);
  
      })

      this.dataDashbord.getnbTaskCompletedByProjetId(this.projets[i].idProjet).subscribe((data:number) => {
        this.nbtask = data;
        this.nbTaskCompAdmin.push(this.nbtask);
  
      })
  
    }
  
  
    for (let i = 0; i < this.myProjets.length; i++) {
     // console.log(i);
      //console.log(this.myProjets[i]);
      this.dataDashbord.getnbTaskByProjetId(this.myProjets[i].idProjet).subscribe((data:number)=> {
        this.nbtask = data;
        this.nbTaskMyProjet.push(this.nbtask);
  
      })

      this.dataDashbord.getnbTaskCompletedByProjetId(this.myProjets[i].idProjet).subscribe((data:number) => {
        this.nbtask = data;
        this.nbTaskCompMyProjet.push(this.nbtask);
  
      })
  
    }

    for (let i = 0; i < this.projetsPOwner.length; i++) {
      // console.log(i);
       //console.log(this.myProjets[i]);
       this.dataDashbord.getnbTaskByProjetId(this.projetsPOwner[i].idProjet).subscribe((data:number)=> {
         this.nbtask = data;
         this.nbTaskProjetPOwner.push(this.nbtask);
   
       })
 
       this.dataDashbord.getnbTaskCompletedByProjetId(this.projetsPOwner[i].idProjet).subscribe((data:number) => {
         this.nbtask = data;
         this.nbTaskCompProjetPOwner.push(this.nbtask);
   
       })
   
     }
   // console.log(this.nbTaskCompSM);
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
  return this.getUserRole()===Role.ADMIN;
}

public get isScrumMaster():boolean{
  return this.isAdmin ||this.getUserRole()===Role.SCRUM_MASTER;
}
public get isScrumMasterOnly():boolean{
  return this.getUserRole()===Role.SCRUM_MASTER;
}




public get isAdminOrScrumMaster():boolean{
  return this.isAdmin ||this.isScrumMaster;
}

public get isProductOwner():boolean{
  return  this.getUserRole()===Role.PRODUCT_OWNER;}


}
