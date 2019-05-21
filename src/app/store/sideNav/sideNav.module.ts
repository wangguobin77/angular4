import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';

import { sideNav } from './sideNav'

@NgModule({
    imports: [RouterModule,CommonModule],
    declarations: [sideNav],
  	exports:[sideNav]
})
export class SideNavModule{}