import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './features/admin/admin.module';
import { PublicModule } from './features/public/public.module';
import { LoginModule } from './features/login/login.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AdminModule,
    PublicModule,
    LoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
