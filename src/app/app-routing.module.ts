import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { Roles } from './constants/Roles';
import { HuespedesComponent } from './components/huespedes/huespedes.component';
import { HuespedComponent } from './components/huesped/huesped.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.ADMIN] },
      },
      {
        path: 'huespedes',
        component: HuespedesComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.ADMIN] },
      },
      {
        path: 'huesped/crear',
        component: HuespedComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.ADMIN, Roles.USER] },
      },
      {
        path: 'huesped/editar/:id',
        component: HuespedComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.ADMIN, Roles.USER] },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
