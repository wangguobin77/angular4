import { NgModule,OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DetailComponent } from './detail.component';
import { GridModule } from '@progress/kendo-angular-grid';
const routes: Routes = [
    { path: '', component: DetailComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [CommonModule,InputsModule,FormsModule,routing,GridModule],
    declarations: [DetailComponent]
})
export class BidDetailModule
{
    
}