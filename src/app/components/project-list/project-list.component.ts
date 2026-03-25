import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  allProjects: any[] = []; // Base de datos completa
  projects: any[] = [];    // Lo que se muestra en pantalla (filtrado)
  semesters: any[] = [];
  selectedSemester: number | null = null;
  selectedProject: any = null; // Para el Modal

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    // 1. Cargar Proyectos
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.allProjects = data;
        this.projects = data;
      },
      error: (err) => console.error('Error al cargar proyectos', err)
    });

    // 2. Cargar Semestres para los botones
    this.projectService.getSemesters().subscribe({
      next: (data) => {
        this.semesters = data.sort((a: any, b: any) => a.id - b.id);
      },
      error: (err) => console.error('Error al cargar semestres', err)
    });
  }

  // 3. Función para filtrar
  filterBySemester(semesterId: number | null) {
    this.selectedSemester = semesterId;

    if (semesterId === null) {
      this.projects = this.allProjects;
    } else {
      // Usamos == en lugar de === por si el ID viene como string desde el backend
      this.projects = this.allProjects.filter(p => p.semester_id == semesterId);
    }
  }

  // --- LÓGICA DEL MODAL ---

  verDetalle(project: any) {
    this.selectedProject = project;
    // Bloquear scroll para mejor experiencia de usuario
    document.body.style.overflow = 'hidden';
  }

  cerrarDetalle() {
    this.selectedProject = null;

    document.body.style.overflow = 'auto';
  }

  searchTerm: string = ''; // Variable para guardar lo que el usuario escribe

  searchProjects(event: any) {
    this.searchTerm = event.target.value.toLowerCase();

    // Filtramos sobre el total de proyectos
    this.projects = this.allProjects.filter(p => {
      const titleMatch = p.title.toLowerCase().includes(this.searchTerm);
      const descMatch = p.description?.toLowerCase().includes(this.searchTerm);

      // Si tienes un semestre seleccionado, respetamos ese filtro también
      const semesterMatch = this.selectedSemester ? p.semester_id === this.selectedSemester : true;

      return (titleMatch || descMatch) && semesterMatch;
    });
  }

}