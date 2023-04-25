import { Component, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IUser, AuthService } from '../../services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { AdminPopUpComponent } from '../admin-pop-up/admin-pop-up.component';
import { Title } from '@angular/platform-browser';

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfMake from 'html-to-pdfmake';

@Component({
   selector: 'app-admin-projects',
   templateUrl: './admin-projects.component.html',
   styleUrls: ['./admin-projects.component.scss']
})

export class AdminProjectsComponent implements AfterViewInit {
  loading: boolean;
  user: IUser;
  projects: any;

  title = 'projectspdf';
  @ViewChild('projectsPDF') projectsPDF: ElementRef;

  displayedColumns: string[] = ['projectid', 'name', 'description', 'submittedAt', 'deadline'];
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
      this.titleService.setTitle("Projects Overview | ROC Swaous");
  }
//LISTENS FOR TRTIGGER AND SETS IP A TABLE FOR PROJECT DETAILS FROM AN API
  public ngAfterViewInit(): void {
    this.authService.getUser().then((user:any) => {
      this.user = user.attributes;

      this.apiService.getProjects().subscribe(data => {
        this.projects = Array.from(data.Items);

        this.dataSource = new MatTableDataSource(this.projects);
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

  public export(): void {
    const doc = new jsPDF();
    const projectsPDF = this.projectsPDF.nativeElement;
    var html = htmlToPdfMake(projectsPDF.innerHTML);
    const docDefinition = { content: html };

    pdfMake.createPdf(docDefinition).open()
  }
//ANIMATION FOR ADMIN POP-UP
  public addProject(): void {
    this.dialog.open(AdminPopUpComponent, {
      width: "700px",
      panelClass: ['animate__animated', 'animate__fadeInDown']
    });
  }
//IF THE USER ATTEMPTS TO REMOVE A PROJECT NOTIFY USER THAT PROJECT IS REMOVED
  public deleteProject(projectId: string, name: string): void {
    this.loading = true;
    this.apiService.deleteProject(this.user.sub, projectId).subscribe({
      next: () => {
        window.alert("Project removed! Congratulations on completing " + name);
        window.location.reload();
      },
      error: () => {
        console.log('ERROR');
      }
    })
  }
}
