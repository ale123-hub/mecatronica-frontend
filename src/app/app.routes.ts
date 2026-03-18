import { Routes } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

export const routes: Routes = [
    { path: '', component: ProjectListComponent },
    { path: 'admin', component: AdminPanelComponent }

];