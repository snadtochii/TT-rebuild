import { Component } from '@angular/core';
import { AuthV2Service } from './services/auth-v2.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthV2Service) {
    authService.handleAuth();
  }
}
