import { NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Loading } from './loading';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [Loading],
  exports: [Loading]
})
export class LoadingModule {
}
