import { Sprint } from "./Sprint";
import { User } from "./User";

export class Task{
    
public idTask:number;
public nameTask:string;
public dateCreation : Date;
public dateModification:Date;
public dateFin:Date;
public description:string;
public   etatTask:string;
public  taskCreePar:User;
public sprint:Sprint;
public  memberAffecter:User;
public archive:boolean;

constructor(){
    this.idTask=0;
    this.nameTask='';
this.description='';
    this.dateCreation=null;
    this.dateFin=null;
   this.dateModification=null;
    this.etatTask='';
    this.archive=false;


this.sprint={    
    idSprint:0,nomSprint:'',dateCreation:null, dateFin:null,dateModification:null,description:'', etatSprint:'',
    sprintCreePar:null,chefAffecter:null,projet:null};
    
    this.taskCreePar= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
    lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
    isActive:false,isNotLocked:false, role:'',authorities:[]}; 

    this.memberAffecter= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
    lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
    isActive:false,isNotLocked:false, role:'',authorities:[]};

}
}