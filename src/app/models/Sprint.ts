
import { Projet } from "./Projet";
import { User } from "./User";

export class Sprint{
    
public idSprint:number;
public nomSprint:string;
public dateCreation : Date;

public dateModification:Date;
public dateFin:Date;
public description:string;



public   etatSprint:string;

public  sprintCreePar:User;
public projet:Projet;
public  chefAffecter:User;

constructor(){
    this.idSprint=0;
    this.nomSprint='';
this.description='';
    this.dateCreation=null;
    this.dateFin=null;
   this.dateModification=null;
    this.etatSprint='';

this.projet={
idProjet:0,nameProjet:'',dateCreation:null, dateEcheance:null,dateModification:null,etatProjet:'',creePar:null};



    
    this.sprintCreePar= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
    lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
    isActive:false,isNotLocked:false, role:'',authorities:[]}; 

    this.chefAffecter= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
    lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
    isActive:false,isNotLocked:false, role:'',authorities:[]};

}
}