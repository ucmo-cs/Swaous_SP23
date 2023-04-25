import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: AdminComponent },
  {path: 'admin/projects', component: AdminProjectsComponent },
  { path: ':user', children: [
    { path: 'reports', component: HomeComponent },
    { path: 'profile', component: ProfileComponent }
  ]},
  { path: '**', redirectTo: 'signin' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
