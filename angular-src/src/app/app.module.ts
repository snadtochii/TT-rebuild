import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { MaterializeModule } from 'angular2-materialize';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
// import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/chart/chart.component';
import { DayDetailsComponent } from './components/day-details/day-details.component';
import { WeeklyTimeStatisticsComponent } from './components/weekly-time-statistics/weekly-time-statistics.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { AddTaskComponent } from './components/add-task/add-task.component';


import { ValidateService } from './services/validate.service';
// import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CasesService } from './services/cases.service';
import { DataHandlersService } from './services/data-handlers.service';
import { TasksService } from './services/tasks.service';
import { CallbackComponent } from './auth/callback/callback.component';
import { AuthV2Service } from './services/auth-v2.service';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    ChartComponent,
    DayDetailsComponent,
    WeeklyTimeStatisticsComponent,
    StatisticsComponent,
    TasksComponent,
    TasksComponent,
    AddTaskComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    // FlashMessagesModule,
    // ChartsModule,
    BrowserAnimationsModule,
    // MaterializeModule
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    CasesService,
    DataHandlersService,
    TasksService,
    AuthV2Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
