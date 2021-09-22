import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Document } from '../models/document';
import { AttachementService } from '../Services/attachement.service';
import { AuthServService } from '../Services/auth-serv.service';
import { DocumentService } from '../Services/document.service';
import { HttpResponse, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from '../enum/notification-type.enum';
import { NotificationService } from '../Services/notification.service';
import { saveAs } from 'file-saver';

import { User } from '../models/User';
import { Role } from '../enum/role.enum';


@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  public selectedDoc:Document;
public userActuel:User;
docPrivate:Document[]=[];
docArchive:Document[]=[];
docArchiveAll:Document[]=[];
  id: number;
  document: Document =  new Document();
  public uploadvalid :boolean = false;
  public editDoc = new Document();


/*   document: Document[] = [];
 */  submited = false;
  messageDoc: string;

  
  selectedFiles: FileList;
  currentFileUpload: File;
  documents: Document[]=[];


  //docPriveUserLogged: Document[] = [];
  documentsPrive: any;
 // docLoggedUser: Document[] = [];
  //motCle: string;
  messageDelete: string;
  submiteDelete = false;
  filename: any;
  submitedFormDoc = false;
  messageFormDOc: string;
  progress: { percentage: number } = { percentage: 0 };
  notificationService: any;
  constructor(private fileUploadService: DocumentService, private router: Router,
    private auth: AuthServService, private fileService: AttachementService, private activateRoute: ActivatedRoute,private notificationSService: NotificationService) { }

  ngOnInit(): void {
    this.userActuel = this.auth.getUserFromLocalCache();

    this.getAllDocuments();
    this.getPrivateDocbyuser(false);
    this.getArchiveDocbyuser(false);
    this.getAllArchivedDocument();
    this.getAllDocumentsPrivate();
 }





 /*  SaveDemo() {
    const file = new Blob(['hello world'], { type: 'text/csv;charset=utf-8' });
    saveAs(file, 'helloworld.csv');
  } */

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
  upload() {
   this.uploadvalid=true;
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.fileUploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');

      }
    });
    this.selectedFiles = undefined;
  }

  savedocument() {
console.log(this.document)
this.document.docUser=this.userActuel;
    this.fileUploadService.saveDocument(this.document).subscribe((data:Document) => {
      console.log(data);
      this.getAllDocuments();
      this.getPrivateDocbyuser(false);
      this.getArchiveDocbyuser(false);
      this.getAllArchivedDocument();
      this.getAllDocumentsPrivate();
      this.uploadvalid=false;
      this.sendNotification(NotificationType.SUCCESS, `${data.nomDocument} added successfully . `);

      this.submitedFormDoc = true;
      this.messageFormDOc = 'Document  added successfully .... ';
    },(errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  }/*  err => {
      this.messageFormDOc = 'Erreur! Vérifier votre Document ... ';
      console.log(err);
    } */);
    this.document = new Document();
  }

  downloadFileToSave(document) {
    this.fileUploadService.getFilebyname(document.file).subscribe(res => {
      this.saveToFileSystem(res);
    });
  }
  private saveToFileSystem(response) {
    console.log('file download response:', response);
    const contentDispositionHeader: string = response.headers.get('Content-Disposition');
    console.log(contentDispositionHeader);
    const parts: string[] = contentDispositionHeader.split(';');
    const filename = parts[1].split('=')[1];
    const blob = new Blob([response['body']], { type: response.headers.get('Content-Type')});
  /*   const url = window.URL.createObjectURL(blob);
    window.open(url); */
    saveAs(blob, filename);
  }



  downloadFile(response) {
 /*    const blob = new Blob([response.body], { type: response.headers.get('Content-Type')});
    console.log(blob);
    const contentDispo: string = response.headers.get('Content-Disposition');
    console.log(contentDispo);
    const parts: string[] = contentDispo.split('.');
    console.log(parts);
    const filename = parts[1].split('=')[1];
    saveAs(blob, filename); */
    console.log('file download response:', response);

    const contentDispositionHeader: string = response.headers.get('Content-Disposition');
    const parts: string[] = contentDispositionHeader.split(';');
    const filename = parts[1].split('=')[1];
    const blob = new Blob([response['body']], { type: response.headers.get('Content-Type')});
    /*var url= window.URL.createObjectURL(blob);
    window.open(url);*/
    saveAs(blob, 'search-csv.csv');
  }





  public onEditDocument(editDoc: Document): void {
    this.editDoc = editDoc;
    
    this.clickButton('openDocEdit');
  }









  
  getAllArchivedDocument() {
    this.fileUploadService.getAllArchivedDocument().subscribe((data:Document[]) => {
      this.docArchiveAll = data;
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

  getAllDocuments() {
    this.fileUploadService.getPublicDocument().subscribe((data:Document[]) => {
      this.documents = data;
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

  getAllDocumentsPrivate() {
    this.fileUploadService.getAllDocumentPrivate().subscribe(data => {
      this.documentsPrive = data;
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

 
  onArchiveDoc(doc:Document) {
    if(this.userActuel.role=="ROLE_ADMIN" || doc.docUser.id== this.userActuel.id){

    this.fileUploadService.archiveDoc(doc.id,doc).subscribe(() => {
      this.sendNotification(NotificationType.INFO, `Document archived  successfully.`);

      console.log('Document  archived ... !!!');
      this.getAllDocuments();
      this.getPrivateDocbyuser(false);
      this.getArchiveDocbyuser(false);
      this.getAllArchivedDocument();
      this.getAllDocumentsPrivate();
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  });} else {
      this.sendNotification(NotificationType.ERROR, "you don't have permission ");
    } 
  }

  onRestoreDoc(doc:Document) {
    this.fileUploadService.restoreDoc(doc.id,doc).subscribe(() => {
      this.sendNotification(NotificationType.INFO, `Document restored  successfully.`);

      console.log('Document  restored ... !!!');
      this.getAllDocuments();
      this.getPrivateDocbyuser(false);
      this.getArchiveDocbyuser(false);
      this.getAllArchivedDocument();
      this.getAllDocumentsPrivate();
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message );
    });
  }
  /* getDocumentPriveByUsername() {
    this.auth.getDocumentPriveByUsername().subscribe( data => {
      this.docPriveUserLogged = data;
    }, err => {
      console.log(err);
    });
  } */
 



/* findDocByUser() {
  this.auth.getDocByUsername().subscribe(data => {
    this.docLoggedUser = data;
  });
} */
deleteDoc(doc:Document) {
  if(this.userActuel.role=="ROLE_ADMIN" || doc.docUser.id== this.userActuel.id){
  this.fileUploadService.deleteDocument(doc.id).subscribe(() => {
    console.log('Document  deleted ... !!!');
    this.sendNotification(NotificationType.SUCCESS, "success deleting");

    this.getAllDocuments();
    this.getPrivateDocbyuser(false);
    this.getArchiveDocbyuser(false);
    this.getAllArchivedDocument();
    this.getAllDocumentsPrivate();
    this.submiteDelete = true;
    this.messageDelete = 'Le Document ' + doc.nomDocument + 'à été supprimer ...';
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  });} else {
    this.sendNotification(NotificationType.ERROR, "you don't have permission ");
  } 
}
getDocumentById() {
  this.fileUploadService.getDocumentById(this.id).subscribe(data => {
    this.document = data;
  });
}
retour() {
  this.router.navigateByUrl('/document');
} 
onUpdateDoc() {
  if(this.userActuel.role=="ROLE_ADMIN" || this.editDoc.docUser.id== this.userActuel.id){

  this.fileUploadService.updateDoc(this.editDoc.id,this.editDoc).subscribe((data:Document) => {
    console.log(this.document);
    this.sendNotification(NotificationType.SUCCESS,`${data.nomDocument} updated successfully.`);

    console.log(data);
    this.getAllDocuments();
    this.getPrivateDocbyuser(false);
    this.getArchiveDocbyuser(false);
    this.getAllArchivedDocument();
    this.getAllDocumentsPrivate();
    this.clickButton('edit-doc-close');

    this.submited = true;
    this.messageDoc = 'Document Modifié avec success ...';
  },(errorResponse: HttpErrorResponse) => {
    console.log(errorResponse);
    this.sendNotification(NotificationType.ERROR, errorResponse.error.message );
  }
  )}else {{
    this.sendNotification(NotificationType.ERROR, "you don't have permission ");
    this.clickButton('edit-doc-close');

  }

  }
}


public getPrivateDocbyuser(showNotification: boolean): void {
   this.fileUploadService.docByusername(this.auth.getUserFromLocalCache().username).subscribe(
    (response: Document[]) => {
this.docPrivate=response;
      console.log(response);

      if (showNotification) {
        this.sendNotification(NotificationType.SUCCESS, `${response.length} doc(s) loaded successfully . `);
      }
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
   }
  )
  
}


 public getArchiveDocbyuser(showNotification: boolean): void {
    this.fileUploadService.docArchiveByusername(this.auth.getUserFromLocalCache().username).subscribe(
      (response: Document[]) => {
  this.docArchive=response;
        console.log(response);
     
        if (showNotification) {
          this.sendNotification(NotificationType.SUCCESS, `${response.length} doc(s) loaded successfully . `);
        }
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
    }
    )
    
 }
  
  


 private sendNotification(notificationType: NotificationType, message: string): void {
  if (message) {
    this.notificationSService.notify(notificationType, message);

  } else {
    this.notificationSService.notify(notificationType, 'An error occured . Please try again.')
  }
}













 
public onSelectDocument(selectedDoc: Document): void {
 

  this.selectedDoc = selectedDoc;
  console.log(this.selectedDoc)
 

 document.getElementById('openDocInfo').click();

}

public saveNewDoc(): void {
  this.clickButton('new-doc-save');
  this.clickButton('new-doc-close');

  console.log("tasksave fonction ");

}

private clickButton(buttonId: string): void {
  document.getElementById(buttonId).click();
}







//get role 
private getUserRole():string{
  return this.auth.getUserFromLocalCache().role;
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



public searchDocuments(searchDocument: string): void {
  console.log(searchDocument);
  const resultsPublic: Document[] = [];
  const resultsPrive: Document[] = [];
  const resultsAllPrivate: Document[] = [];

  
  //search private doc of current user
for (const doc of this.docPrivate) {
    
    if (doc.nomDocument.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1 ||
      doc.typeDocument.toString().indexOf(searchDocument.toLowerCase()) !== -1 ||
      doc.file.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1 ||
      doc.docUser.username.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1) {
      resultsPrive.push(doc);
      this.docPrivate = resultsPrive;


    }

  }
  this.docPrivate = resultsPrive;
  if (resultsPrive.length === 0 || !searchDocument) {
    this.getPrivateDocbyuser(false);
    //console.log("err")
  }



//search all public doc
for (const doc of this.documents) {

  if (doc.nomDocument.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1 ||
  doc.typeDocument.toString().indexOf(searchDocument.toLowerCase()) !== -1 ||
  doc.file.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1 ||
  doc.docUser.username.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1) {
    resultsPublic.push(doc);
  this.documents = resultsPublic;


}

}
this.documents = resultsPublic;
if (resultsPublic.length === 0 || !searchDocument) {
  this.getAllDocuments()
//this.docPrivate = this.projetServ.getProjetsFromLocalCache().filter(p=>p.client.role=="ROLE_PRODUCT_OWNER");
//console.log("err")
}

// liste tous les doc prive just admin

for (const doc of this.documentsPrive) {
if (doc.nomDocument.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1 ||
      doc.typeDocument.toString().indexOf(searchDocument.toLowerCase()) !== -1 ||
      doc.file.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1 ||
      doc.docUser.username.toLowerCase().indexOf(searchDocument.toLowerCase()) !== -1) {
      resultsAllPrivate.push(doc);
      this.documentsPrive = resultsAllPrivate;


    }
}
this.documentsPrive = resultsAllPrivate;
if (resultsAllPrivate.length === 0 || !searchDocument) {
  this.getAllDocumentsPrivate();
//this.documentsPrive=this.projetServ.getProjetsFromLocalCache().filter(p=>p.creePar.role=="ROLE_SCRUM_MASTER")

}

}











}
/* function saveAs(blob: Blob, arg1: string) {
  throw new Error('Function not implemented.');
} */

