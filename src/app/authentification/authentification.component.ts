import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServService } from '../Services/auth-serv.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {
  erreur : boolean = false;

  constructor(private auth:AuthServService, private router : Router) { }

  ngOnInit(): void {
  }



  Connect(f) {
    this.auth.seConnecter(f.value).subscribe(
      (response) => {
        const myToken = response['id']; //récupération du token
        localStorage.setItem('token' ,myToken);
        this.router.navigate(['/gereUser']);
      },
      (error) => {
        this.erreur = true;
        f.reset();
      }
    )}
}
