import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { IUser, AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfMake from 'html-to-pdfmake';

@Component({
  selector: 'app-report-pop',
  templateUrl: './report-pop.component.html',
  styleUrls: ['./report-pop.component.scss']
})

//PROPERTIES FOR REPORT POP-UP AS WELL AS SETTING AND INITILIZING DEPENDENCIES
export class ReportPopComponent implements OnInit {
  reportForm: any;
  loading: boolean;
  isAdmin: boolean;
  user: IUser;
  emp: IUser;
  report: any;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  
  constructor(
    public dialogRef: MatDialogRef<ReportPopComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialog: MatDialog,
    private router: Router, 
    private apiService: ApiService, 
    private authService: AuthService) {
      this.loading = false;
      this.isAdmin = false;
      this.user = {} as IUser;
      this.emp = {} as IUser;
  }
  
  title = 'reportpdf';
  @ViewChild('reportPDF') reportPDF: ElementRef;

  public ngOnInit(): void {
    this.authService.getUser().then((user:any) => {
      this.user = user.attributes;

      //CHECKS USER ATTRIBUTES TO VIEW IF THE USER IS AN ADMIN OR NOT AND PASS THE ATTRIBUTES BASED OFF OF EACH
      
      if(user.attributes.sub == "9a2c5f3d-45b8-4c2b-b5cf-f13a17dd693b") {
        this.isAdmin = true;
        this.apiService.getReport(this.data.empId, this.data.reportId).subscribe(data => {
          this.report = data;
        });
      } else {
        this.apiService.getReport(user.attributes.sub, this.data.reportId).subscribe(data => {
          this.report = data;
        });
      }
      

      this.loading = true;
      this.trigger.openMenu();
    });
  }

  public export(): void {
    const doc = new jsPDF();
    const reportPDF = this.reportPDF.nativeElement;
    var html = htmlToPdfMake(reportPDF.innerHTML);
    const docDefinition = { content: html };

    pdfMake.createPdf(docDefinition).open()
  }
//POP-UP FOR SENDING EMAILS AND PASSES CONSTRICTORS SET FROM IT
  public sendEmail(emailData: any): void {
    this.apiService.sendEmail(emailData, this.user.sub, this.report.reportId).subscribe({
      next: () => {
        if(this.isAdmin) {
          window.alert("Report emailed! Check your inbox!");
          this.router.navigate(['/' + 'admin']).then(() => {
            window.location.reload();
          });
        } else {
          window.alert("Report emailed to advisor!");
          this.router.navigate(['/' + this.user.sub, 'reports']).then(() => {
            window.location.reload();
          });
        }
      },
      error: () => {
        console.log('ERROR');
      }
    })
  }

  public send(): void {
    this.loading = true;

    const params = {
      emailAddress: this.report.email,
      empName: this.report.empName,
      reportText: this.report.reportText,
      projects: this.report.projects,
      submittedAt: this.report.submittedAt
    }

    this.sendEmail(params);
  }

  public deleteReport(): void {
    this.loading = true;
    this.apiService.deleteReport(this.user.sub, this.report.empId, this.report.reportId).subscribe({
      next: () => {
        window.alert("Report has been deleted!");
        this.router.navigate(['/' + 'admin']).then(() => {
          window.location.reload();
        });
      },
      error: () => {
        console.log('ERROR');
      }
    })
  }

  public close(): void {
    this.dialog.closeAll();
  }
}
