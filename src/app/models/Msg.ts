import { User } from "./User";

export class Msg{
    
public idMsg:number;
public msg:string;
public dateCreation : Date;

public roomName:string;
public  sender:User;
public  receiver:User;
public vu:boolean;

constructor(){
    this.idMsg=0;
    this.msg='';
this.roomName='';
    this.dateCreation=null;
    this.vu=false;
    this.sender= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
    lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
    isActive:false,isNotLocked:false, role:'',authorities:[]}; 

    this.receiver= { id: 0, userId :'' ,username:'',email:'',telephone:'',professionUser:'',
    lastLoginDate:null,lastLoginDateDisplay:null,joinDate:null,profileImageUrl:'',
    isActive:false,isNotLocked:false, role:'',authorities:[]};

}
}