import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { DataHandlersService } from './data-handlers.service';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class CasesService {

  constructor(private http: Http, private dataHandlersService: DataHandlersService) { }

  getCases(user) {
    let data = {
      username: JSON.parse(user).username
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.serverUrl}/users/cases`, data, { headers: headers })
      .map(res => res.json());
  }

  getDailyCases(user, date = new Date()) {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let data = {
      username: JSON.parse(user).username,
      date: day,
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.serverUrl}/users/cases/details`, data, { headers: headers })
      .map(res => res.json());
  }

  getWeeklyCasesTime(user, date = new Date()) {
    let weekDates = this.dataHandlersService.getWeekDates(date);
    let data = {
      username: JSON.parse(user).username,
      startDate: weekDates.startDate,
      endDate: new Date(weekDates.endDate.getFullYear(), weekDates.endDate.getMonth(), weekDates.endDate.getDate() + 1)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.serverUrl}/users/cases/weekly/time`, data, { headers: headers })
      .map(res => res.json());
  }
}
