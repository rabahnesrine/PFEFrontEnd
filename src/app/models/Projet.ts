import { User } from "./User";

export class Projet{

    public idProjet:number;
    public nameProjet:string;
    public dateCreation : Date;

    public   dateEcheance:Date;
    public dateModification:Date;
    public   etatProjet:string;
    
    public  creePar:User;


    constructor(){
        this.idProjet=0;
        this.nameProjet='';

        this.dateCreation=null;
        this.dateEcheance=null;
       this.dateModification=null;
        this.etatProjet='';
        
        this.creePar= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
        lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
        isActive:false,isNotLocked:false, role:'',authorities:[]};

    }

}