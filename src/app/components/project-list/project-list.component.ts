import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  allProjects: any[] = [];
  semesters: any[] = [];

  // Estados de filtro
  selectedCategory: string = 'Todos';
  selectedSemester: number | null = null;
  searchTerm: string = '';

  selectedProject: any = null;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.projectService.getProjects().subscribe({
      next: (data) => this.allProjects = data,
      error: (err) => console.error('Error al cargar proyectos', err)
    });

    this.projectService.getSemesters().subscribe({
      next: (data) => {
        this.semesters = data.sort((a: any, b: any) => a.id - b.id);
      },
      error: (err) => console.error('Error al cargar semestres', err)
    });
  }

  // Esta función es la que usa el *ngFor en el HTML
  getFilteredProjects() {
    return this.allProjects.filter(p => {
      // Normalizamos ambos strings para evitar fallos por tildes o mayúsculas
      const projectCat = this.normalizeText(p.category || 'Mecatrónica');
      const selectedCat = this.normalizeText(this.selectedCategory);

      // Si es 'Todos', pasa. Si no, comparamos.
      const categoryMatch = this.selectedCategory === 'Todos' || projectCat === selectedCat;

      const semesterMatch = this.selectedSemester === null || p.semester_id == this.selectedSemester;

      const search = this.searchTerm.toLowerCase().trim();
      const titleMatch = p.title.toLowerCase().includes(search);
      const descMatch = p.description ? p.description.toLowerCase().includes(search) : false;

      return categoryMatch && semesterMatch && (titleMatch || descMatch);
    });
  }

  // Función para limpiar el texto (tildes, espacios y mayúsculas)
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Simplificamos los métodos (ya no necesitan llamar a getFilteredProjects manualmente)
  selectCategory(category: string) { this.selectedCategory = category; }
  selectSemester(semesterId: number | null) { this.selectedSemester = semesterId; }
  onSearch(event: any) { this.searchTerm = event.target.value; }

  verDetalle(project: any) {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
  }

  cerrarDetalle() {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }
}