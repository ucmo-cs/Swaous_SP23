import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IUser, AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})

export class PopUpComponent implements OnInit {
  reportForm: any;
  loading: boolean;
  user: IUser;
  projects: any;


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
      
      this.apiService.getProjects().subscribe(data => {
        this.projects = Array.from(data.Items);
      });

      this.loading = true;
    });

    this.initForm();
  }

  initForm() {
    this.reportForm = this.formBuilder.group({
      name: [''],
      reportText: ['', [Validators.required]],
      date: [this.datePipe.transform((new Date), 'MM/dd/yyyy')],
      projects: ['', [Validators.required]]
    });

    console.log(this.reportForm);
    this.loading = false;
  }

  public submitReport(reportData: any): void {
    this.apiService.createReport(reportData, this.user.sub).subscribe({
      next: () => {
        this.router.navigate(['/' + this.user.sub, 'reports']).then(() => {
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
      empName: this.user.name,
      email: this.user.email,
      reportText: this.reportForm.value.reportText,
      projects: this.reportForm.value.projects,
      submittedAt: this.datePipe.transform((new Date), 'MM/dd/yyyy')
    }

    this.submitReport(params);
  }

  public close(): void {
    this.dialog.closeAll();
  }
}
