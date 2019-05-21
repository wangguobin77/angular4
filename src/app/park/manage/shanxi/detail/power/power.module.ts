import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { Power}  from './power.component';
import { Jsonp, JsonpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridEditFormComponent }  from './edit-form.component';
import { EditService } from './edit.service';
const powerRoute: Routes = [
    {
        path: '',
        component:Power,
    }
];
@NgModule({
  imports:      [ CommonModule, FormsModule,InputsModule,ReactiveFormsModule,JsonpModule,DialogModule,GridModule,RouterModule.forChild(powerRoute) ],
  declarations: [Power,GridEditFormComponent],
  exports: [
    RouterModule
  ],
  providers: [EditService]
})
export class ParkPowerModule{}