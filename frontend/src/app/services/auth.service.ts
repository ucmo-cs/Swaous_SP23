import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';

import awsconfig from '../../aws-exports';

export interface IUser {
  sub: string,
  email: string,
  password: string,
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticationSubject: BehaviorSubject<any>;

  constructor(private router: Router) {
    Amplify.configure({
      Auth: awsconfig.awsmobile
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
        email: user.email,
        name: user.name
      }
    });
  }

  public confirmUser(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  async signIn(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password).then(() => {
      this.authenticationSubject.next(true);
    });
  }
  
  async signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      window.localStorage.clear();
      this.authenticationSubject.next(false);
    });
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  async isAuthenticated(): Promise<boolean> {
    if(this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser().then((user:any) => {
        if(user) {
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
    }
  }

  async updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser().then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }
}
