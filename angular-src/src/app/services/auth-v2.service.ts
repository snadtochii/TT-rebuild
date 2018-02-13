import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from '../auth/auth.config';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators/catchError';
import { error } from 'util';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthV2Service {

  private auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  userProfile: any;

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  isAdmin: boolean;

  constructor(private router: Router, private http: HttpClient) {
    const lsProfile = localStorage.getItem('profile');

    if (this.tokenValid) {
      this.userProfile = JSON.parse(lsProfile);
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.setLoggedIn(true);
    } else if (!this.tokenValid && lsProfile) {
      this.logout();
    }
  }

  setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login(redirect?: string) {
    const redirectTo = redirect ? redirect : this.router.url;
    localStorage.setItem('authRedirect', redirectTo);

    this.auth0.authorize();
  }

  handleAuth() {
    this.auth0.parseHash((err, authResult) => {
      console.log(authResult);
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.getProfile(authResult);
      } else if (err) {
        this.clearRedirect();
        this.router.navigate(['/']);
        console.error(`Error authenticating: ${err.error}`);
      }
    });
  }

  private getProfile(authResult) {
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      console.log(profile);
      if (profile) {
        this.setSession(authResult, profile);
        this.router.navigate([localStorage.getItem('authRedirect') || '/']);
        this.clearRedirect();
        this.storeUserData(profile).subscribe(res => console.log(res));
      } else if (err) {
        console.error(`Error authenticating: ${err.error}`);
      }
    });
  }

  private setSession(authResult, profile) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('profile', JSON.stringify(profile));

    this.userProfile = profile;
    // this.isAdmin = this.checkAdmin(profile);
    // localStorage.setItem('isAdmin', this.isAdmin.toString());
    this.setLoggedIn(true);
  }

  private checkAdmin(profile) {
    const roles = profile[AUTH_CONFIG.NAMESPACE] || [];
    console.log(profile, roles, AUTH_CONFIG.NAMESPACE);
    return roles.indexOf('admin') > -1;
  }

  private clearRedirect() {
    localStorage.removeItem('authRedirect');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('authRedirect');
    localStorage.removeItem('isAdmin');

    this.clearRedirect();

    this.isAdmin = undefined;
    this.userProfile = undefined;

    this.setLoggedIn(false);
    this.router.navigate(['/']);
  }

  get tokenValid(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  storeUserData(profile) {
    console.log(profile);
    return this.http.post(environment.serverUrl + environment.api.users.saveUser, profile);
  }

}
