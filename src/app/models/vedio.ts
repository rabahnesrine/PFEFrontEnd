export class Video{
  
id:number;
nomVedio:string;
description:string;
file:string;
dateCreation:Date;
authorisation:string;

constructor(){
    this.id=0;
    this.dateCreation=null;
    this.authorisation='';
    this.description='';
    this.file='';
    this.nomVedio='';
}

}