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
  confirmed: boolean;
  user: IUser;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private titleService: Title) {
      this.loading = false;
      this.confirmed = false;
      this.user = {} as IUser;
      this.titleService.setTitle("Sign Up | ROC Swaous");
    }

  ngOnInit() {
    this.initForm();
  }

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

    console.log(this.signupForm);
    this.loading = false;
  }

  showPassword() {
    const toggle = document.getElementById('togglePassword');
    var pswd = document.getElementById("pswd");
    var type = pswd.getAttribute('type') === 'password' ? 'text' : 'password';
    
    pswd.setAttribute('type', type);

    var eye = toggle.getAttribute('class') === 'far fa-eye' ? 'far fa-eye-slash' : 'far fa-eye';

    toggle.setAttribute('class', eye);
  }

  showConfirmedPassword() {
    const toggleConfirm = document.getElementById('toggleConfirmPassword');
    var confirmPswd = document.getElementById("confirmPswd");
    var type = confirmPswd.getAttribute('type') === 'password' ? 'text' : 'password';

    confirmPswd.setAttribute('type', type);

    var eye = toggleConfirm.getAttribute('class') === 'far fa-eye' ? 'far fa-eye-slash' : 'far fa-eye';

    toggleConfirm.setAttribute('class', eye);
  }

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