import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSuccessComponent } from './authsuccess.component';
import { HeaderModule } from '../../+common/header/header.module';
import { Routes, RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../+common/services/auth.service';

const authsuccessRoute: Routes = [
  { path: '', component: AuthSuccessComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authsuccessRoute)],
  declarations: [AuthSuccessComponent],
})
export class AuthSuccessModule {

}
