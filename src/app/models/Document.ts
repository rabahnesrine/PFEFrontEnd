import { User } from "./User";

export class Document {
    id: number;
    nomDocument: string;
    typeDocument: string;
    description: string;
    file: string;
    etat: boolean;
    archive:boolean;
    docUser:User;
    dateCreation:Date;


    constructor(){
        this.id=0;
        this.nomDocument='';
        this.typeDocument='';
        this.description='';     
        this.file='';
        this.dateCreation=null;
        this.etat=true;
        this.archive=false;
        this.docUser= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
        lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
        isActive:false,isNotLocked:false, role:'',authorities:[]};
    
  
}
  }