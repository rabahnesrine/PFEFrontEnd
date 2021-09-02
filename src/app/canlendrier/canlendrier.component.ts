import { Component, OnInit } from '@angular/core';
import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';
import { Calendrier } from '../models/Calandrier';
import { AuthServService } from '../Services/auth-serv.service';
import { CalandrieServService } from '../Services/calandrie-serv.service';


@Component({
  selector: 'app-canlendrier',
  templateUrl: './canlendrier.component.html',
  styleUrls: ['./canlendrier.component.css']
})
export class CanlendrierComponent implements OnInit {
  
public userid:number;
  isLogin:boolean=false;
 
  listCalendrier:Calendrier[]=[];
  public currentDate: Date = new Date();
  public newViewMode: View = 'Month';
  public eventData: EventSettingsModel = {
    dataSource: [

      {
        Id: 1,
        Subject: 'Board Meeting',
        StartTime: new Date(2021, 7, 13, 9, 0),
        EndTime: new Date(2021, 7, 13, 11, 0)
      },
      {
        Id: 2,
        Subject: 'Training session on JSP',
        StartTime: new Date(2021, 7, 15, 15, 0),
        EndTime: new Date(2021, 7, 15, 17, 0)
      }
    ]
}
calend:Calendrier;
   constructor(private authserv:AuthServService,private calandrierServ:CalandrieServService  ) { }

  ngOnInit(): void {
    console.log("date"+new Date());
    this.authserv.isLoggedIn();
    console.log(this.eventData.dataSource)
   //this.getCalendrier();
    this.userid=this.authserv.getUserFromLocalCache().id;
   // this.addEventToCalendrier();
console.log(this.eventData.dataSource[0]);

  }



  getCalendrier(){
    this.calandrierServ.getEvent().subscribe((res: any) => {
      this.listCalendrier.push(res);
      console.log(this.listCalendrier)
        console.log('data');
        this.eventData={
          dataSource: this.listCalendrier
        }
        console.log(this.eventData.dataSource)
  });
}





 /*  getCalendrier(){
    this.calandrierServ.postTypeRequest('user/calendrier',null).subscribe((res: any) => {
        this.listCalendrier=res.data;
        console.log('data'+this.listCalendrier);
        console.log(this.listCalendrier);
        this.eventData={
          dataSource: this.listCalendrier
        }
  });
} */

  /* addEventToCalendrier(){
    this.calandrierServ.postTypeRequest('/user/addtoCalendrier',null).subscribe((res: Calendrier) => {
        this.listCalendrier.push(res);
        console.log('datapost');
        console.log(this.listCalendrier);
        this.eventData={
          dataSource: this.listCalendrier
        }
  });

}  */


  /*  addEventToCalendrier(){
    this.calandrierServ.postTypeRequest('/user/addEvent',null).subscribe((res: any) => {
        this.listCalendrier=res;
        console.log('datapost');
        console.log(this.listCalendrier);
        this.eventData={
          dataSource: this.listCalendrier
        }
  });

} 
  getCalendrier(){
    this.calandrierServ.getTypeRequest(this.authserv.getUserFromLocalCache().id).subscribe((res: any) => {
      this.listCalendrier.push(res);
      console.log(this.listCalendrier)
        console.log('data');
        this.eventData={
          dataSource: this.listCalendrier
        }
        console.log(this.eventData.dataSource)
  });
}

 */



}
