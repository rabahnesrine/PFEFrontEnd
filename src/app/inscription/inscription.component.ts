import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServService } from '../Services/user-serv.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  constructor(private userServ: UserServService, private router:Router) { }

  ngOnInit(): void {
  }



  addUser(newUse) {
    console.log(newUse);

    this.userServ.addUserAPI(newUse).subscribe(
      (response) => {
        console.log(response);
        console.log("POST Successful !");
        this.router.navigate(['\gereUser']);
      },
      (error) => {
        console.log("Error with POST ", error);
        
      } )
    }


/*   addUser(){}
 */
}
