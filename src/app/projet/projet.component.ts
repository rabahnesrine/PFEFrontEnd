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


@Component({
  selector: 'app-projet',
  templateUrl:'./projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  public projets: Projet[];
  public myProjets:Projet [];
  public userActuel: User;
  public nameProjet: string = '';
  public dateEcheance: Date = null;
  public refreshProjet: boolean;
  public selectedProjet: Projet;
  public selectProjetDelete: Projet;
  public editProjet = new Projet();




  constructor(private projetServ: ProjetServService, private notificationService: NotificationService, private router: Router, private userServ: UserServService, private authServ: AuthServService) { }

  ngOnInit(): void {
    this.getProjets(false);

    this.userActuel = this.authServ.getUserFromLocalCache(); // recupere user actuel 
    console.log("create projet by" + this.authServ.currentUserlogged());
  }







  public getProjets(showNotification: boolean): void {
    this.refreshProjet = true;
    this.projetServ.getProjets().subscribe(
      (response: Projet[]) => {

        console.log(response);
        this.projetServ.addProjetsToLocalCache(response);
        this.projets = response;
        this.refreshProjet = false;

        this.getMyProjets()

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





  public getMyProjets(): void {
    this.refreshProjet = true;
    this.myProjets = this.projets.filter(p => p.creePar.id==this.userActuel.id);
  // console.log(this.projets.find(p => p.creePar.username=="med"));
console.log(this.myProjets);
    
  }






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
    for (const projet of this.projetServ.getProjetsFromLocalCache()) {
      console.log(projet);
      console.log("test2" + projet.nameProjet)
      if (projet.nameProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
        projet.dateCreation.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
        projet.dateEcheance.toString().indexOf(searchProjet.toLowerCase()) !== -1 ||
        projet.etatProjet.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1 ||
        projet.creePar.username.toLowerCase().indexOf(searchProjet.toLowerCase()) !== -1) {
        results.push(projet);
        console.log(results);
        this.projets = results;
        console.log(this.projets);


      }

    }
    this.projets = results;
    if (results.length === 0 || !searchProjet) {
      this.projets = this.projetServ.getProjetsFromLocalCache();
      // document.getElementById("refreshProjButton").click();

      console.log("err")
    }

  }



  public onDeleteProjet(id: number): void {
    console.log(this.projets.find(p => p.idProjet == id)
    );

    this.selectProjetDelete = this.projets.find(p => p.idProjet == id);
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

public get isAdminOrScrumMaster():boolean{
  return this.isAdmin ||this.isScrumMaster;
}



}
