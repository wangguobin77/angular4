import { NgModule } from '@angular/core';
import { SlidebarModule } from '../slidebar/slidebar.module';
import { HeaderModule } from '../header/header.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [],
    declarations: [],
    exports: [SlidebarModule, HeaderModule]
})

export class LayoutModule { }
