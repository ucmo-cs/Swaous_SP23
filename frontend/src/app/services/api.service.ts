import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Constants } from '../shared/constants/constants';
import { IUser, AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  user: IUser;
  private url = environment.apiUrl;
  private emp = Constants.EMP_ROUTES.EMP;
  private admin = Constants.ADMIN_ROUTES.ADMIN;
  private reports = Constants.EMP_ROUTES.REPORTS;
  private projects = Constants.EMP_ROUTES.PROJECTS;
  private createNewReport = Constants.EMP_ROUTES.NEWREPORT;
  private createNewProject = Constants.ADMIN_ROUTES.NEWPROJECT;
  private delete = Constants.ADMIN_ROUTES.DELETE;
  private email = Constants.EMP_ROUTES.EMAIL;

  

  constructor(private http: HttpClient, private authService: AuthService) {
    this.user = {} as IUser;
    
  }
  
  getReports(userId: string) {
    return this.http.get<any>(this.url + this.emp + '/' + userId + this.reports);
  }

  getAllReports(adminId: string) {
    return this.http.get<any>(this.url + this.admin + '/' + adminId + this.reports);
  }

  getProjects() {
    return this.http.get<any>(this.url + this.projects);
  }

  getReport(userId: string, reportId: string) {
    return this.http.get<any>(this.url + this.emp + '/' + userId + this.reports + '/' + reportId);
  }

  getProject(adminId: string, projectId: string) {
    return this.http.get<any>(this.url + this.admin + '/' + adminId + this.projects + '/' + projectId);
  }

  sendEmail(requestParams: any, userId: string, reportId: string) {
    return this.http.post<any>(this.url + this.emp + '/' + userId + this.reports + '/' + reportId + this.email, requestParams);
  }

  createReport(requestParams: any, userId: string) {
    return this.http.post<any>(this.url + this.emp + '/' + userId + this.createNewReport, requestParams);
  }

  createProject(requestParams: any, adminId) {
    return this.http.post<any>(this.url + this.admin + '/' + adminId + this.projects + this.createNewProject, requestParams);
  }

  deleteReport(adminId: string, empId: string, reportId: string) {
    return this.http.delete<any>(this.url + this.admin + '/' + adminId + this.emp + '/' + empId + this.reports + '/' + reportId + this.delete);
  }

  deleteProject(adminId: string, projectId: string) {
    return this.http.delete<any>(this.url + this.admin + '/' + adminId + this.projects + '/' + projectId + this.delete);
  }
}
