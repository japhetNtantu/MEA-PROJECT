import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule)
  },
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
},
{
  path: 'public',
  loadChildren: () => import('./features/public/public.module').then(m => m.PublicModule)
},
{ path: '', redirectTo: '/public/home', pathMatch: 'full' }, 
{ path: '**', redirectTo: '/public/home' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
