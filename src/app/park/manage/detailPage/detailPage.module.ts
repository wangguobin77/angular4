import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Aptitude } from './aptitudeUpLoad/aptitude.component';
import { UploadModule } from '@progress/kendo-angular-upload';
const detailPageRoute: Routes = [
    {
        path: 'aptitude',
        component: Aptitude,
    }
];
@NgModule({
    imports: [
        UploadModule,
        RouterModule.forChild(detailPageRoute)
    ],
    declarations: [Aptitude],
    exports: [
        RouterModule
    ]
})
export class ParkDetailPageModule { }