import { Task } from "./Task";

export class Attachement { 
public idAttachement:number;
public file:string;
public dateCreation : Date;

public taskAtt:Task;
constructor(){
    this.idAttachement=0;
    this.file='';
    this.dateCreation=null;


this.taskAtt={
idTask:0,nameTask:'',dateCreation:null, dateFin:null,dateModification:null,description:'',
etatTask:'',taskCreePar:null,memberAffecter:null,sprint:null,archive:false};

}
}