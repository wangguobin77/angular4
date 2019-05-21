import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SlidebarComponent } from '../slidebar/slidebar.component'

import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule,FormsModule,HttpModule,RouterModule],
    declarations: [SlidebarComponent],
    exports: [SlidebarComponent]
})

export class SlidebarModule {}
