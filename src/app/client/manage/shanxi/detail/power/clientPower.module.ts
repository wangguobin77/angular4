import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { Power}  from './power.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
const powerRoute: Routes = [
    {
        path: '',
        component:Power,
    }
];
@NgModule({
  imports:      [ CommonModule, FormsModule,InputsModule,ReactiveFormsModule,DialogModule,GridModule,RouterModule.forChild(powerRoute) ],
  declarations: [Power],
  exports: [
    RouterModule
  ],
  providers: []
})
export class ClientPowerModule{
  
}