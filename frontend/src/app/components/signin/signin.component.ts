import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser, AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

//SIGN IN CLASS WITH CONSTRUCTOR AND SETS AND INITILIZES PARAMATERS
export class SigninComponent {
  signinForm: any;
  loading: boolean;
  hide: boolean;
  user: IUser;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private titleService: Title) {
    this.loading = false;
    this.hide = true;
    this.user = {} as IUser;
    this.titleService.setTitle("Sign In | ROC Swaous");
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      pswd: ['', [Validators.required]]
    });

    console.log(this.signinForm);
    this.loading = false;
  }
// CREATES USER OBJECT AND HANDLE AUTHENTICATION AND CAN INFORM USERS OF INCORRECT PASSWORD AND OR EMAIL
  public signIn(): void {
    this.loading = true;
    this.user.email = this.signinForm.value.email;
    this.user.password = this.signinForm.value.pswd;
    
    this.authService.signIn(this.user).then(() => {
      this.authService.getUser().then((user:any) => {
        this.user = user.attributes;

        if(user.attributes.sub == "9a2c5f3d-45b8-4c2b-b5cf-f13a17dd693b") {
          this.router.navigate(['/admin']).then(() => {
            window.location.reload();
          });
        } else {
          this.router.navigate(['/' + user.attributes.sub, 'reports']).then(() => {
            window.location.reload();
          });
        }
      });
    }).catch(() => {
      this.loading = false;
      window.alert("Incorrect Email or Password! Try again.");
    });
  }
}
