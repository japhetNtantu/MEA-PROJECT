import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { PopupComponent } from './popup/popup.component';
import { FormsModule } from '@angular/forms';
import { CartDropdownComponent } from './cart-dropdown/cart-dropdown.component';

@NgModule({
  declarations: [
    HomeComponent,
    PopupComponent,
    CartDropdownComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule
  ],
  exports: [
    CartDropdownComponent
  ]
})
export class PublicModule { }
