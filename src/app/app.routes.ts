import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { authGuard } from './auth.guard'; // <--- Importa tu guard aquí

export const routes: Routes = [
  // 1. RUTA PÚBLICA: Cualquier persona entra a la raíz y ve los proyectos
  { path: '', component: ProjectListComponent },

  // 2. LOGIN: Para que el administrador se identifique
  { path: 'login', component: LoginComponent },

  // 3. RUTA PROTEGIDA: Solo entra el admin si el authGuard dice que hay token
  { 
    path: 'admin', 
    component: AdminPanelComponent, 
    canActivate: [authGuard] 
  },

  // 4. COMODÍN: Si alguien escribe cualquier cosa mal, lo envia al inicio
  { path: '**', redirectTo: '', pathMatch: 'full' }
];