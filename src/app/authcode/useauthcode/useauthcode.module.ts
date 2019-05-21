import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../../+common/header/header.module';
import { Routes, RouterModule, Router } from '@angular/router';
import { UseAuthCodeComponent } from './useauthcode.component'

const useauthcodeRoute: Routes = [
  { path: '', component: UseAuthCodeComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(useauthcodeRoute)],
  declarations: [UseAuthCodeComponent],
})
export class UseAuthCodeModule { }
