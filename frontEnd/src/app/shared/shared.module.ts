
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { LayoutComponent } from '../layout/layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule // Needed for <router-outlet>
  ],
  exports: [
    SidebarComponent,
    NavbarComponent,
    LayoutComponent
  ]
})
export class SharedModule { }
