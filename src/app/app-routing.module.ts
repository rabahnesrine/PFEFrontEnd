import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanlendrierComponent } from './canlendrier/canlendrier.component';
import { ChatComponent } from './chat/chat.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { DocumentComponent } from './document/document.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login.component';
import { MsgComponent } from './msg/msg.component';
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
{path:'chat',component:ChatComponent, canActivate: [AuthenticationGuard] },
{path:'msg',component:MsgComponent, canActivate: [AuthenticationGuard] },
{path:'dashbord',component:DashbordComponent, canActivate: [AuthenticationGuard] },
{path:'document',component:DocumentComponent, canActivate: [AuthenticationGuard] },

{path:'Calandrie',component:CanlendrierComponent, canActivate: [AuthenticationGuard] },

{path:'', redirectTo:'/login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
