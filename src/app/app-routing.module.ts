import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { GereUserComponent } from './gere-user/gere-user.component';
import { InscriptionComponent } from './inscription/inscription.component';


const routes: Routes = [
  {path:"inscription",component:InscriptionComponent},
  {path:"gereUser",component:GereUserComponent},
  {path:"authentification",component:AuthentificationComponent},
  {path:"", redirectTo:"/users", pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
