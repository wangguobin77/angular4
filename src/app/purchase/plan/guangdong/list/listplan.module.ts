import { NgModule,OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataService } from './list.service';
import { ListComponent } from './list.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { CommonModule } from '@angular/common';
const routes: Routes = [
    { path: '', component: ListComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, 
        CommonModule,
        GridModule,
        DialogModule,
        GridModule,],
    declarations: [ListComponent],
    providers: [DataService]
})
export class ListModule
{
    
}