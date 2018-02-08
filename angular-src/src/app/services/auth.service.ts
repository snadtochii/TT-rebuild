import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class AuthService {

  user: any;

  constructor(private http: Http) { }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.serverUrl}/users/register`, user, { headers: headers })
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.serverUrl}/users/authenticate`, user, { headers: headers })
      .map(res => res.json());
  }

  getProfile() {
    return Observable.of(JSON.parse(localStorage.getItem('user')));
  }

  storeUserData(token, user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  logedIn() {
    return localStorage.getItem('user');
  }

  logout() {
    this.user = null;
    localStorage.clear();
  }
  getUser() {
    return localStorage.getItem('user');
  }
}