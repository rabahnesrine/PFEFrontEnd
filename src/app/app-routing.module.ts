import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjetComponent } from './projet/projet.component';
import { RegisterComponent } from './register/register.component';
import { SprintComponent } from './sprint/sprint.component';
import { TasksComponent } from './tasks/tasks.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},

{path:'user/management',component:UserComponent, canActivate: [AuthenticationGuard] },
  {path:'projet',component:ProjetComponent, canActivate: [AuthenticationGuard] },
{path:'sprint',component:SprintComponent, canActivate: [AuthenticationGuard] },
{path:'profile',component:ProfileComponent, canActivate: [AuthenticationGuard] },
{path:'tasks/:idSprint',component:TasksComponent, canActivate: [AuthenticationGuard] },


{path:'', redirectTo:'/login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
