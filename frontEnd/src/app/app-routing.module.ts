import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { UsersComponent } from './layout/users/users.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'public',
    loadChildren: () =>
      import('./features/public/public.module').then((m) => m.PublicModule),
  },
  { path: '', redirectTo: '/public/home', pathMatch: 'full' },
  // {
  //   path: '',
  //   component: LayoutComponent,
  //   children: [
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'users', component: UsersComponent },
  //   ],
  // },
  { path: '**', redirectTo: '/public/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
