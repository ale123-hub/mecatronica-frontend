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

  getFilteredProjects() {
    return this.allProjects.filter(p => {
      const projectCat = this.normalizeText(p.category || 'Mecatrónica');
      const selectedCat = this.normalizeText(this.selectedCategory);

      const categoryMatch = this.selectedCategory === 'Todos' || projectCat === selectedCat;
      const semesterMatch = this.selectedSemester === null || p.semester_id == this.selectedSemester;

      const search = this.searchTerm.toLowerCase().trim();
      const titleMatch = p.title.toLowerCase().includes(search);
      const descMatch = p.description ? p.description.toLowerCase().includes(search) : false;

      return categoryMatch && semesterMatch && (titleMatch || descMatch);
    });
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  selectCategory(category: string) { this.selectedCategory = category; }
  selectSemester(semesterId: number | null) { this.selectedSemester = semesterId; }
  onSearch(event: any) { this.searchTerm = event.target.value; }

  // --- FUNCIÓN ACTUALIZADA PARA EL CARRUSEL ---
  verDetalle(project: any) {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden'; // Bloquea el scroll del fondo

    // Esperamos 100ms a que Angular renderice el modal y el ID "projectCarousel" exista
    setTimeout(() => {
      const carouselElement = document.getElementById('projectCarousel');
      if (carouselElement && (window as any).bootstrap) {
        // Inicializamos el carrusel de Bootstrap manualmente
        new (window as any).bootstrap.Carousel(carouselElement, {
          interval: 3000,
          ride: 'carousel',
          wrap: true
        });
      }
    }, 150);
  }

  cerrarDetalle() {
    this.selectedProject = null;
    document.body.style.overflow = 'auto'; // Devuelve el scroll al fondo
  }
}