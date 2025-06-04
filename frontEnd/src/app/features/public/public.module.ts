import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { PopupComponent } from './popup/popup.component';
import { FormsModule } from '@angular/forms';
import { CartDropdownComponent } from './cart-dropdown/cart-dropdown.component';
import { ComposeComponent } from './compose/compose.component';
import { OrderComponent } from './order/order.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    HomeComponent,
    PopupComponent,
    CartDropdownComponent,
    ComposeComponent,
    OrderComponent,
    SettingsComponent
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
