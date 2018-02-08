import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Task } from '../models';

import { DataHandlersService } from './data-handlers.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class TasksService {

  constructor(private http: Http, private dataHandlersService: DataHandlersService, private authService: AuthService) { }

  addTask(user, task: Task) {
    let data = {
      username: JSON.parse(user).username,
      title: task.title,
      desc: task.description,
      time: task.time,
      date: task.date
    };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.serverUrl}/users/tasks/new`, data, { headers: headers })
      .map(res => res.json());
  }

  getWeeklyTasks(user, date: Date = new Date()) {
    let weekDates = this.dataHandlersService.getWeekDates(date);
    let data = {
      username: JSON.parse(user).username,
      startDate: weekDates.startDate,
      endDate: new Date(weekDates.endDate.getFullYear(), weekDates.endDate.getMonth(), weekDates.endDate.getDate() + 1)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.serverUrl}/users/tasks/weekly`, data, { headers: headers })
      .map(res => res.json());
  }
  getWeeklyTasksTime(user, date: Date = new Date()) {
    let weekDates = this.dataHandlersService.getWeekDates(date);
    let data = {
      username: JSON.parse(user).username,
      startDate: weekDates.startDate,
      endDate: new Date(weekDates.endDate.getFullYear(), weekDates.endDate.getMonth(), weekDates.endDate.getDate() + 1)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.serverUrl}/users/tasks/weekly/time`, data, { headers: headers })
      .map(res => res.json());
  }
}
