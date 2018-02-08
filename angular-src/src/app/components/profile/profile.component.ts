import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit() {
    this.authservice.getProfile().subscribe(user => {
      this.user = user;
    },
    err=>{
      return false;
    })
  }

}
