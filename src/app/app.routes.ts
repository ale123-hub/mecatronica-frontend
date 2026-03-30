import { Routes } from '@angular/router';
import { InstitucionalComponent } from './components/institucional/institucional.component';
import { LoginComponent } from './components/login/login.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { authGuard } from './auth.guard'; 

export const routes: Routes = [
  // 1. Lo primero que ve la gente al entrar a la web
  { path: '', component: InstitucionalComponent },

  // 2. La galería de proyectos (a donde lleva el botón rojo)
  { path: 'proyectos', component: ProjectListComponent },

  // 3. Acceso para el administrador
  { path: 'login', component: LoginComponent },

  // 4. Panel de control (Solo con Token)
  { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard] },

  // 5. Si alguien se pierde, lo regresamos a la Misión/Visión
  { path: '**', redirectTo: '', pathMatch: 'full' }
];