import { Component } from '@angular/core';
import { Role } from './enum/role.enum';
import { AuthServService } from './Services/auth-serv.service';

@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TacheApp';
public logged:boolean;
constructor(public authServ: AuthServService){}




//get role 
private getUserRole():string{
  return this.authServ.getUserFromLocalCache().role;
}

public get isAdmin():boolean{
  return this.getUserRole()=== Role.ADMIN;
}

public get isScrumMaster():boolean{
  return this.isAdmin ||this.getUserRole()=== Role.SCRUM_MASTER;
}

public get isChef():boolean{
  return this.isAdmin ||this.isScrumMaster|| this.getUserRole()==Role.CHEF;
}

public get isMember():boolean{
  return this.isAdmin ||this.isScrumMaster||this.isChef|| this.getUserRole()==Role.MEMBER;
}

public get isAdminOrScrumMaster():boolean{
  return this.isAdmin ||this.isScrumMaster;}

  public get isAdminOrScrumMasterOrChef():boolean{
    return this.isAdmin ||this.isScrumMaster||this.isChef;
  }
  

}
