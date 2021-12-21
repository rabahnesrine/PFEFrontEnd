import { User } from "./User";

export class Event {

     id:number;
    subject: string;
    timeEvent:string
    lieu: string;
    description: string;
    categorie: string;
    etatEvent: string;
    archive:boolean;
    eventUser:User;
    dateCreation:Date;
    dateModification:Date;
    startDate:Date;
    endDate:Date;
    invitedPersons :number[];

    constructor(){
        this.id=0;
        this.subject='';
        this.timeEvent='';
        this.description='';     
        this.lieu='';
        this.categorie='';
        this.dateCreation=null;
        this.dateModification=null;
        this.startDate=null;
        this.endDate=null;
        this.etatEvent='';
        this.archive=false;
        this.invitedPersons=[];
        this.eventUser= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
        lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
        isActive:false,isNotLocked:false, role:'',authorities:[]};
    
  
}
  }




