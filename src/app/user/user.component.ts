import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserServService } from '../Services/user-serv.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
 private titleSubject= new BehaviorSubject<string>('Users');    //actual subject
 public titleAction$=this.titleSubject.asObservable(); //action listener

public user:any;
public size:number=5;
public currentPage:number=0;
public totalPages:number;
public pages:Array<number>;
public currentKeyword:string="";



  constructor(private httpclient:HttpClient, private userServ: UserServService) { }

  ngOnInit(): void {
   // this.getlistUser();
  }
public changeTitle(title:string):void{
this.titleSubject.next(title);
}

/*
onGetUsers(){
  this.userServ.getUsers(this.currentPage,this.size)
  .subscribe(data=>{
  this.totalPages=data["page"].totalPages;
this.pages=new Array<number>(this.totalPages);
this.user=data;},err=>{
      console.log(err);
  })
}

onPageUser(i){
  this.currentPage=i;
 //this.ChercherUsers();
  this.onGetUsers(); // pour charger les users de nouveau
 // this.onChercher({keyword:this.currentKeyword});

}


getlistUser(){
  this.userServ.findlist()
  .subscribe((reponse)=>{this.users=reponse
  },err=>console.log(err))

}




 /*  onGetUsers(){
    this.httpclient.get("http://localhost:8080/users").subscribe( (data)=>{
      this.users=data},(err)=>{console.log("err");})

  }
 */
}
