import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { AuthServService } from './Services/auth-serv.service';
import { UserServService } from './Services/user-serv.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './Services/notification.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { ProjetComponent } from './projet/projet.component';
import { SprintComponent } from './sprint/sprint.component';
import { ProfileComponent } from './profile/profile.component';
import { TasksComponent } from './tasks/tasks.component';
import { ChatStreamComponent } from './chat-stream/chat-stream.component';
import { ChatComponent } from './chat/chat.component';
import { ChatuserComponent } from './chatuser/chatuser.component';
import { WebSocketServiceService } from './web-socket-service.service';
import { MsgComponent } from './msg/msg.component';
import { UpcomingToLatestPipePipe } from './upcoming-to-latest-pipe.pipe';
import { DashbordComponent } from './dashbord/dashbord.component';
import { CanlendrierComponent } from './canlendrier/canlendrier.component';
import { AgendaService, DayService, MonthService, ScheduleModule, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';
import { DocumentComponent } from './document/document.component';
import { EventComponent } from './event/event.component';
import { JwPaginationComponent } from './jw-pagination/jw-pagination.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { FirstWindowsComponent } from './first-windows/first-windows.component';
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    ProjetComponent,
    SprintComponent,
    ProfileComponent,
    TasksComponent,
    ChatStreamComponent,
    ChatComponent,
    ChatuserComponent,
    MsgComponent,
    UpcomingToLatestPipePipe,
    DashbordComponent,
    CanlendrierComponent,
    DocumentComponent,
    EventComponent,
    JwPaginationComponent,
    FirstWindowsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationModule,
    ScheduleModule,
    JwPaginationModule


  ],
  providers: [NotificationService, AuthenticationGuard, AuthServService,UserServService,WebSocketServiceService,{provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true},AgendaService, DayService, WeekService, WorkWeekService, MonthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
