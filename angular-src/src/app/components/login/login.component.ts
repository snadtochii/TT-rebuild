import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { FlashMessagesService } from 'angular2-flash-messages';

import { AuthService, ValidateService } from '../../services';
import { AuthV2Service } from '../../services/auth-v2.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    // private flashMessagesService: FlashMessagesService,
    private validateService: ValidateService,
    private authV2Service: AuthV2Service
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
    if (!this.validateService.validateLogin(user)) {
      // this.flashMessagesService.show('Please enter login and password', {
      //   cssClass: 'alert-danger',
      //   timeout: 5000
      // });
      return;
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        // this.flashMessagesService.show('You are now logged in', {
        //   cssClass: 'alert-success',
        //   timeout: 5000
        // });
        this.router.navigate(['dashboard']);
      } else {
        // this.flashMessagesService.show(data.msg, {
        //   cssClass: 'alert-danger',
        //   timeout: 5000
        // });
        this.router.navigate(['login']);
      }
    });
  }

  login() {
    this.authV2Service.login();
  }
}
