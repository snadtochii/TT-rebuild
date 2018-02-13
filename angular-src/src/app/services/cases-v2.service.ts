import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataHandlersService } from './data-handlers.service';
import { HttpHeaders } from '@angular/common/http/src/headers';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators/catchError';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CasesV2Service {

  constructor(
    private http: HttpClient,
    private dataHandlersService: DataHandlersService) {
  }


  getUserCasesByDate(userId, startDate: Date = new Date(), endDate?: Date) {
    let weekDates;
    if (!endDate) {
      weekDates = this.dataHandlersService.getWeekDates(startDate);
    } else {
      weekDates = { startDate, endDate };
    }

    const data = {
      userId: userId,
      ...weekDates
    };

    let params = new HttpParams();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.append(key, data[key]);
      }
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get(`${environment.serverUrl}/users/cases/weekly/time`, { params, headers })
    .pipe(catchError(err => Observable.throw(err)));
  }
}
