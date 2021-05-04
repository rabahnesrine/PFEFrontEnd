export class User{

    public idUser:number;
    public  identifiant:string;
    public  nomUser:string;
    public emailUser:string;
    public   telephone:string;
    public dateInscrit : Date;
    public   professionUser:string;
    public   profileImgUrl:string;
    public  lastLoginDate :Date;
    public  lastLoginDateDisplay :Date;
    public roles:string ; //admin_role {read ,edit,delete},membre... /chef d'equipe /scrumMaster ....
    public   authorities:[];
    public isActive :boolean;
    public  isNotLocked:boolean;


    constructor(){
        this.nomUser='';
        this.emailUser='';
        this.telephone='';
        this.isActive=false;
        this.isNotLocked=false;
        this.roles='';
        this.authorities=[];

    }

}