import { NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ShufflingComponent } from './shuffling'

@NgModule({
    imports: [RouterModule,CommonModule],
    declarations: [ShufflingComponent],
  	exports:[ShufflingComponent]
})
export class ShufflingModule{

}