import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IUser, AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-pop-up',
  templateUrl: './admin-pop-up.component.html',
  styleUrls: ['./admin-pop-up.component.scss']
})

export class AdminPopUpComponent implements OnInit {
  projectForm: any;
  loading: boolean;
  user: IUser;
  projects: any;

//CONSTRUCTORS 
  constructor(private dialog: MatDialog, 
    private formBuilder: FormBuilder,
    private router: Router, 
    private apiService: ApiService, 
    private authService: AuthService, 
    private datePipe: DatePipe) {
    this.loading = false;
    this.user = {} as IUser;
  }
  
  public ngOnInit(): void {
    this.authService.getUser().then((user:any) => {
      this.user = user.attributes;

      this.loading = true;
    });

    this.initForm();
  }
//SET FORUM ATRIBUTES TO REQUIRED AS WELL AS SETTING THE DATE IN FULL FORM
  initForm() {
    this.projectForm = this.formBuilder.group({
      projectId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      submittedAt: [this.datePipe.transform((new Date), 'MM/dd/yyyy')],
      deadline: ['', [Validators.required]]
    });

    console.log(this.projectForm);
    this.loading = false;
  }
//FOR SUBMITTED PROJECTS TAKE USER TO ADMIN PROJECTS AND IF NEEDED THROW AN ERROR
  public submitProject(projectData: any): void {
    this.apiService.createProject(projectData, this.user.sub).subscribe({
      next: () => {
        this.router.navigate(['/admin/projects']).then(() => {
          window.location.reload();
        });
      },
      error: () => {
        console.log('ERROR');
      }
    })
  }

  public submit(): void {
    this.loading = true;
    const params = {
      projectId: this.projectForm.value.projectId,
      name: this.projectForm.value.name,
      description: this.projectForm.value.description,
      submittedAt: this.datePipe.transform((new Date), 'MM/dd/yyyy'),
      deadline: this.projectForm.value.deadline
    }

    this.submitProject(params);
  }

  public close(): void {
    this.dialog.closeAll();
  }
}
