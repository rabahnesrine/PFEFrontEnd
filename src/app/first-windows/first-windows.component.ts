import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpResponse, HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { NotificationType } from '../enum/notification-type.enum';
import {  Video } from '../models/vedio';
import { NotificationService } from '../Services/notification.service';
import { VedioService } from '../Services/vedio.service';
import { Subscription } from 'rxjs';
import { User } from '../models/User';
import { UserServService } from '../Services/user-serv.service';
import { Projet } from '../models/Projet';
import { ProjetServService } from '../Services/projet-serv.service';
import { SprintService } from '../Services/sprint.service';
import { TaskService } from '../Services/task.service';
import { Sprint } from '../models/Sprint';
import { Task } from '../models/Task';

@Component({
  selector: 'app-first-windows',
  templateUrl: './first-windows.component.html',
  styleUrls: ['./first-windows.component.css']
})
export class FirstWindowsComponent implements OnInit {
  vedio: Video =  new Video();

  selectedVideo:Video;

allVedio:Video[]=[];
  public uploadvalid :boolean = false;
  public vediospath:File[];
testVedio:File;

nom:string='ntest'
filen:string='test.mp4'


//private subscriptions :Subscription[]=[];

filev:File;
ft:Video;

  currentFileUpload: File;
  filename: any;
  submitedFormDoc = false;
  messageFormDOc: string;
  progress: { percentage: number } = { percentage: 0 };
  notificationService: any;
  selectedFiles: FileList;
  videoSource:string='';
  
  @ViewChild('videoPlayer') videoplayer: ElementRef;


  users:User[];

  constructor(private vedioserv :VedioService,private notificationSService: NotificationService,private userServ:UserServService,private projetServ:ProjetServService,private sprintServ:SprintService,private taskService:TaskService) { }

  ngOnInit(): void {
    this.getAllVedio()
   // this.getpath()
  //this.getVed()
  this.getUsers();
this.getProjets();
this.getSprints();
this.getTasks();
  }



  
  public sortvideo(videos:Video[]):void{
    this.allVedio.sort((a: Video, b: Video) => {
      let date1 = new Date(a.dateCreation);
      let date2 = new Date(b.dateCreation);
      
      if (date1 > date2) {
      return 1;}
      
    else if (date1 < date2) {
      return -1;
      }
       else {
      return 0; } 
    });
  }


  public getUsers():void{
    this.userServ.getUsers().subscribe(
      (response:User[])=>{
  
       // console.log(response);
        this.userServ.addUsersToLocalCache(response);
        this.users=response.filter(u=>u.username!="AnonymeMember").filter(u=>u.username!="AnonymeChef").filter(u=>u.username!="AnonymeProductOwner");
      
      }
    );
    
  }
  
  public getProjets(): void {
    this.projetServ.getProjets().subscribe(
      (response: Projet[]) => {
        console.log(response);
        this.projetServ.addProjetsToLocalCache(response);
      
      }
    )
    
  }

  public getSprints(): void {
    this.sprintServ.getSprints().subscribe(
      (response: Sprint[]) => {
        console.log(response);
        this.sprintServ.addSprintsToLocalCache(response);
      
      }
    )
    
  }
  public getTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (response: Task[]) => {
        console.log(response);
        this.taskService.addTasksToLocalCache(response);
      
      }
    )
    
  }
  



  toggleVideo(event:any) {
    console.log(event)
    console.log("togg")
  //  console.log(this.selectedVideo)
      this.videoplayer.nativeElement.play();

  }

  selectedV(v){
    this.selectedVideo=v;
    console.log("select")
    console.log(this.selectedVideo.nomVedio)


  }


  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

   upload() {
    this.uploadvalid=true;
     this.progress.percentage = 0;
     this.currentFileUpload = this.selectedFiles.item(0);
     this.vedioserv.pushFileToStorage(this.currentFileUpload).subscribe(event => {
       if (event.type === HttpEventType.UploadProgress) {
         this.progress.percentage = Math.round(100 * event.loaded / event.total);
       } else if (event instanceof HttpResponse) {
         console.log('File is completely uploaded!');
 console.log(this.currentFileUpload)
       }
     });
     this.selectedFiles = undefined;
   }
  

   public saveNewVedio(): void {
    this.clickButton('new-doc-save');
    this.clickButton('new-doc-close');
  
  
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }
  

  getAllVedio(){
    this.vedioserv.getAllVedio().subscribe((data:Video[])=>{
    console.log(data)


    this.allVedio=data
    this.sortvideo(this.allVedio);
    console.log(this.sortvideo(this.allVedio))
console.log(this.allVedio)
}
    );
  }


getVed(){
//  this.vedioserv.getvediobyname(this.vedio.nomVedio,this.vedio.file).subscribe((data:File)=>
  this.vedioserv.getvediobyname(this.filen).subscribe((data:File)=>
  { this.filev=data;
  })
  
}

getpath(){
this.vedioserv.getvediofromPath(this.nom).subscribe((data:File)=>{
this.testVedio=data;
console.log(data)
}
)
}



/* 
public onAddvedio(): void{
  const formData=this.vedioserv.createVedioFormData(this.vedio, this.file);
  console.log(formData);
  this.subscriptions.push(
  this.vedioserv.addVedio(formData).subscribe((response:Vedio)=>{
    this.uploadvalid=false;

     this.file= null;
     this.sendNotification(NotificationType.SUCCESS,`${response.nomVedio} added successfully . `);

  },
  (errorResponse:HttpErrorResponse)=>{
    console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.file= null;

        }
        )
        );
}
 */







   saveVedio() {
 console.log(this.vedio)
// this.vedio.docUser=this.userActuel;
     this.vedioserv.saveVedio(this.vedio).subscribe((data:Video) => {
       console.log(data);
      
       this.uploadvalid=false;
       this.sendNotification(NotificationType.SUCCESS, `${data.nomVedio} added successfully . `);
 
       this.submitedFormDoc = true;
       this.messageFormDOc = 'vedio  added successfully .... ';
     },(errorResponse: HttpErrorResponse) => {
       console.log(errorResponse);
       this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
   }/*  err => {
       this.messageFormDOc = 'Erreur! Vérifier votre Document ... ';
       console.log(err);
     } */);
     this.vedio = new Video();
   }


   private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationSService.notify(notificationType, message);
  
    } else {
      this.notificationSService.notify(notificationType, 'An error occured . Please try again.')
    }
  }


  
/* ngOnDestroy():void{
  this.subscriptions.forEach(sub=>sub.unsubscribe());
} */

}
function nomVedio(nomVedio: any, file: any) {
  throw new Error('Function not implemented.');
}

