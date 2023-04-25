import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser, AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  updateForm: any;
  loading: boolean;
  user: IUser;

  //CONSTRUCTORS FOR PROFILE PAGE 
  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private titleService: Title) {
      this.loading = false;
      this.user = {} as IUser;
      this.titleService.setTitle("User Profile | ROC Swaous");
  }

  public ngOnInit(): void {
    this.authService.getUser().then((user:any) => {
      this.user = user.attributes;

      this.loading = true;
    });

    this.initForm();
  }
//CONSTRUCTORS FOR FORM
  initForm() {
    this.updateForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });

    console.log(this.updateForm);
    this.loading = false;
  }
//UPDATE VALUES UPON CHANGING USER INFORMATION
  public updateUser(): void {
    this.loading = true;
    this.user.name = this.updateForm.value.name;
    this.user.email = this.updateForm.value.email;

    this.authService.updateUser(this.user).then(() => {
      this.loading = false;
      this.router.navigate(['/' + this.user.sub, 'reports']).then(() => {
        window.location.reload();
      });
//ALERTS FOR UPDATING USER DATA
      window.alert("User information updated!");
    }).catch(() => {
      this.loading = false;
      window.alert("Updating user information failed! Try again.");
    })
  }
}
