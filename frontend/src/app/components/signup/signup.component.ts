import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser, AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: any;
  codeForm: any;
  loading: boolean;
  hide: boolean;
  hideCon: boolean;
  confirmed: boolean;
  user: IUser;
//SIGNUP CONSTRUCTORS
  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private titleService: Title) {
      this.loading = false;
      this.hide = true;
      this.hideCon = true;
      this.confirmed = false;
      this.user = {} as IUser;
      this.titleService.setTitle("Sign Up | ROC Swaous");
    }

  ngOnInit() {
    this.initForm();
  }
//SETS NEEDED INFORMATION TO REQUIRED
  initForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      pswd: ['', [Validators.required]],
      confirmPswd: ['', [Validators.required]]
    });

    this.codeForm = this.formBuilder.group({
      code: ['', [Validators.required]]
    })

    console.log(this.signupForm, this.codeForm);
    this.loading = false;
  }
//VALIDATION FOR PASSWORD IT READS AS THE PASSWORD AREA IS BEING CREATED AND MUST MEET THE REQUIREMENTS STATED IN SIGNUP.HTML
//ONCE ALL ARE SET TO VALID IT ALLOWS CREATION OF THE PASSWORD FOR THE USER ACCOUNT.
  pswdCred() {
    //Declare variables connecting password characters to page
    var password = this.signupForm.value.pswd;
    var lower = document.getElementById('lower');
    var capital = document.getElementById('capital');
    var number = document.getElementById('number');
    var special = document.getElementById('special');
    var length = document.getElementById('length');


    //Lowercase letter validation
    if(/[a-z]/g.test(password)) {
      lower.setAttribute('class', 'valid');
    } else {
      lower.setAttribute('class', 'invalid');
    }

    //Capital letter validation
    if(/[A-Z]/g.test(password)) {
      capital.setAttribute('class', 'valid');
    } else {
      capital.setAttribute('class', 'invalid');
    }

    //Number validation
    if(/[0-9]/g.test(password)) {
      number.setAttribute('class', 'valid');
    } else {
      number.setAttribute('class', 'invalid');
    }

    //Special character validation
    var specialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    if(specialCharacters.test(password)) {
      special.setAttribute('class', 'valid');
    } else {
      special.setAttribute('class', 'invalid');
    }

    //Length validation
    if(password.length >= 8) {
      length.setAttribute('class', 'valid');
    } else {
      length.setAttribute('class', 'invalid');
    }
  }

  public signUp(): void {
    this.loading = true;
    this.user.name = this.signupForm.value.name;
    this.user.email = this.signupForm.value.email;
    this.user.password = this.signupForm.value.pswd;

    this.authService.signUp(this.user).then(() => {
      this.loading = false;
      this.confirmed = true;
    }).catch(() => {
      this.loading = false;
    });
  }
//METHOD FOR 2FA VALIDATION AND CATCHES AN ERROR IF THE 2FA CODE IS NO LONGER VALID OR WRONG
  public confirmUser(): void {
    this.loading = true;
    this.user.code = this.codeForm.value.code;

    this.authService.confirmUser(this.user).then(() => {
      this.router.navigate(['/signin']).then(() => {
        window.location.reload();
      });
    }).catch(() => {
      this.loading = false;
      window.alert("Incorrect Code! Try again.");
    });
  }
}