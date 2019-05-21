import { NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from './header.component';
import { MenuComponent } from './menu.component';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [HeaderComponent, MenuComponent],
  exports: [HeaderComponent]
})
export class HeaderModule {
}
