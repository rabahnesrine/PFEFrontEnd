import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprint } from '../models/Sprint';
import { DataDashbordService } from '../Services/data-dashbord.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
totalAnnule:any;
totalUnstarted:any;
totalInProgress:any;
totalFinish:any;
totalArchive:any;
totaltask:any;
totalTacheUser:any;
totaltaskbySprint:any;
nbSprintbyProjet:any;
sprints:Sprint[];


projet:number=368;
nbrsprints:any;
nbTaskCompleted:any;
sprintsPro:Sprint[];

//Sprint
totalSprint:any;
totalSDevelopment:any;
totalSDelivery:any;
totalSPaused:any;
totalSTesting:any;
//Projet
totalProjet:any;
totalPActive:any;
totalPPaused:any;
totalPCompleted:any;
totalPSuspended:any;




  constructor(private dataDashServ:DataDashbordService) { }

  ngOnInit(): void {
    this.getTotalTaskCancel();
    this.getTotalTaskToFinish();
    this.getTotalTaskUnstarted();
    this.getTotalTaskInProgress();
    this.getTotalTask();
    this.getTotalTaskArchive();
    this.getTotalTacheByUsername();
    this.getTotalTacheBySprint(194);
   // this.getSprintByProjet(192);
    this.getTotalSprintByProjet(201);



    this.getnbTaskByProjetID();
    this. getnbTaskCompletedByProjetID();


this.getTotalSprintDelivery()
this.getTotalSprintPaused()
this.getTotalSprintDevelopment()
this.getTotalSprint()
this.getTotalSprintTesting()

this.getTotalProjetActive()
this.getTotalProjetPaused()
this.getTotalProjetSuspended()
this.getTotalProjetCompleted()
this.getTotalProjet()
  }

  getTotalTacheByUsername() {
    this.dataDashServ.getTotalTacheByUsername().subscribe(data => {
      this.totalTacheUser = data;
      console.log("tache ness")
      console.log(this.totalTacheUser);
    });
  }


  getTotalTaskCancel() {
    this.dataDashServ.getTotalTacheCancel().subscribe(data => {
      this.totalAnnule = data;
      console.log(data);
    });
  }

  getTotalTaskUnstarted() {
    this.dataDashServ.getTotalTacheUnstarted().subscribe(data => {
      this.totalUnstarted = data;
      console.log(data);
    });
  }
  getTotalTaskInProgress() {
    this.dataDashServ.getTotalTacheInProgress().subscribe(data => {
      this.totalInProgress = data;
      console.log(data);
    });
  }
  getTotalTaskToFinish() {
    this.dataDashServ.getTotalTacheToFinish().subscribe(data => {
      this.totalFinish = data;
      console.log(data);
    });
  }


  getTotalTask() {
    this.dataDashServ.getTotalTache().subscribe(data => {
      this.totaltask = data;
      console.log(data);
    });
  }
  getTotalTaskArchive() {
    this.dataDashServ.getTotalTacheArchived().subscribe(data => {
      this.totalArchive = data;
      console.log(data);
    });
  }


  getTotalTacheBySprint(idsprint:number) {
    this.dataDashServ.getTotalTacheBySprint(idsprint).subscribe(data => {
      this.totaltaskbySprint = data;
      console.log("nb task by sprint")

      console.log(data);
    });}


    getTotalSprintByProjet(idProjet:number) {
      this.dataDashServ.getTotalSprintByProjet(idProjet).subscribe(data => {
        this.nbSprintbyProjet = data;
        console.log("sprint de ce projet egale")
  
        console.log(data);
      });}
    
  

    getSprintByProjet(idProjet:number):void {
      this.dataDashServ.getSprintByProjetId(idProjet).subscribe((data :Sprint[])=> {
        this.sprints = data;  
        console.log(data);}
        );
      } 

      getnbTaskByProjetID() {
        this.dataDashServ.getnbTaskByProjetId(this.projet).subscribe(data => {
          this.nbrsprints= data;
          console.log("nb task projet ")

          console.log(this.nbrsprints);
        });}

        getnbTaskCompletedByProjetID() {
          this.dataDashServ.getnbTaskCompletedByProjetId(this.projet).subscribe(data => {
            this.nbTaskCompleted= data;
            console.log("nb task projet ")
  
            console.log(this.nbrsprints);
          });}
  
  


        getSprintByProjetID() {
          this.dataDashServ.getSprintByProjetId(this.projet).subscribe(data => {
            this.sprintsPro = data;
            console.log(this.sprintsPro);
          });} 

//sprint
getTotalSprint() {
  this.dataDashServ.getTotalSprint().subscribe(data => {
    this.totalSprint = data;
    console.log(data);
  })}

  getTotalSprintDelivery() {
    this.dataDashServ.getTotalSprintDelivery().subscribe(data => {
      this.totalSDelivery = data;
      console.log(data);
    });
  }
  getTotalSprintTesting() {
    this.dataDashServ.getTotalSprintTesting().subscribe(data => {
      this.totalSTesting = data;
      console.log(data);
    });
  }
  getTotalSprintDevelopment() {
    this.dataDashServ.getTotalSprintDevelopment().subscribe(data => {
      this.totalSDevelopment = data;
      console.log(data);
    });
  }
  getTotalSprintPaused() {
    this.dataDashServ.getTotalSprintPaused().subscribe(data => {
      this.totalSPaused = data;
      console.log(data);
    });
  }

  //projet

  getTotalProjetPaused() {
    this.dataDashServ.getTotalProjetPaused().subscribe(data => {
      this.totalPPaused = data;
      console.log(data);
    });
  }

  getTotalProjetActive() {
    this.dataDashServ.getTotalProjetActive().subscribe(data => {
      this.totalPActive = data;
      console.log(data);
    });
  }
  getTotalProjetSuspended() {
    this.dataDashServ.getTotalProjetSuspended().subscribe(data => {
      this.totalPSuspended = data;
      console.log(data);
    });
  }
  getTotalProjetCompleted() {
    this.dataDashServ.getTotalProjetCompleted().subscribe(data => {
      this.totalPCompleted = data;
      console.log(data);
    });
  }
  getTotalProjet() {
    this.dataDashServ.getTotalProjet().subscribe(data => {
      this.totalProjet = data;
      console.log(data);
    });
  }


      }



