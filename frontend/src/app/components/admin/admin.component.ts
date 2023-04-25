import { Component, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IUser, AuthService } from '../../services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ReportPopComponent } from '../report-pop/report-pop.component';
import { Title } from '@angular/platform-browser';

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfMake from 'html-to-pdfmake';

@Component({
   selector: 'app-admin',
   templateUrl: './admin.component.html',
   styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements AfterViewInit {
  loading: boolean;
  user: IUser;
  reports: any;

  title = 'reportspdf';
  @ViewChild('reportsPDF') reportsPDF: ElementRef;

  displayedColumns: string[] = ['empName', 'submittedAt', 'projects', 'reportStatus'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private apiService: ApiService, 
    private authService: AuthService,
    private titleService: Title) {
      this.loading = false;
      this.user = {} as IUser;
      this.titleService.setTitle("Admin | ROC Swaous");
  }
//CALL GETUSER AND SET ARRAYS FOR THE REPORTS
  public ngAfterViewInit(): void {
    this.authService.getUser().then((user:any) => {
      this.user = user.attributes;

      this.apiService.getAllReports(user.attributes.sub).subscribe(data => {
        this.reports = Array.from(data.Items);

        this.dataSource = new MatTableDataSource(this.reports);
        this.changeDetectorRef.detectChanges();

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });

      
      
      this.loading = true;
    });
  }

  public filter(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.dataSource.filter = val.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
//CONTENTS FOR REPORT
  public export(): void {
    const doc = new jsPDF();
    const reportsPDF = this.reportsPDF.nativeElement;
    var html = htmlToPdfMake(reportsPDF.innerHTML);
    const docDefinition = { content: html };

    pdfMake.createPdf(docDefinition).open()
  }
//ANIMATION FOR REPORT POP-UP
  public viewReport(empId: string, reportId: string): void {
    this.dialog.open(ReportPopComponent, {
      width: "700px",
      panelClass: ['animate__animated', 'animate__fadeInDown'],
      data: {
        empId: empId,
        reportId: reportId
      }
    });
  }
}
