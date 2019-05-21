import { NgModule,OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DetailComponent } from './detail.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';

const routes: Routes = [
    { path: '', component: DetailComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [CommonModule,GridModule,DropDownsModule,DialogModule,InputsModule,FormsModule,routing],
    declarations: [DetailComponent]
})
export class DetailModule
{
    
}