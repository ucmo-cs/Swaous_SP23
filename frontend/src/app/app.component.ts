import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, AuthService } from './services/auth.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

//PROPERTIES FOR APP COMPONENT
export class AppComponent implements OnInit {
  user: IUser;
  isAuthenticated: boolean;
  isAdmin: boolean;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  
  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = false;
    this.isAdmin = false;
  }

  //MENU TRIGGER AS WELL AS USER AUTH ENVOKER
  ngOnInit() {
    this.authService.isAuthenticated().then(() => {
      this.isAuthenticated = true;

      this.authService.getUser().then((user:any) => {
        this.user = user.attributes;

        if(user.attributes.sub == "9a2c5f3d-45b8-4c2b-b5cf-f13a17dd693b") {
          this.isAdmin = true;
        }
      })
    });

    this.trigger.openMenu();
  }

  //CHECKS IF ADMIN IF NOT CLEARS SIGNIN 
  public signOut(): void {
    this.authService.signOut().then(() => {
      this.isAuthenticated = false;

      if(this.isAdmin) {
        this.isAdmin = false;
      }

      window.localStorage.clear();
      this.router.navigate(['/signin']);
    });
  }
}