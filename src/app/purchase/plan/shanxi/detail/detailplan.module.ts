import { NgModule,OnInit  } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { DetailComponent } from './detail.component';
import { GridModule } from '@progress/kendo-angular-grid';
import {NgClass} from '@angular/common';
const routes: Routes = [
    { path: '', component: DetailComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [FormsModule,ReactiveFormsModule,routing,CommonModule,GridModule],
    declarations: [DetailComponent]
})
export class DetailModule
{
    
}