export class User{

    public id:number;
    public  userId:string;
    public  username:string;
    public email:string;
    public   telephone:string;
    public joinDate : Date;
    public   professionUser:string;
    public   profileImageUrl:string;
    public  lastLoginDate :Date;
    public  lastLoginDateDisplay :Date;
    public role:string ; //admin_role {read ,edit,delete},membre... /chef d'equipe /scrumMaster ....
    public   authorities:[];
    public isActive :boolean;
    public  isNotLocked:boolean;


    constructor(){
        this.id=0;
        this.userId='';
        this.username='';
        this.email='';
        this.telephone='';
        this.professionUser='';
        this.joinDate=null;
        this.lastLoginDate=null;
        this.lastLoginDateDisplay=null;
        this.profileImageUrl='';
        this.isActive=false;
        this.isNotLocked=false;
        this.role='';
        this.authorities=[];

    }

}