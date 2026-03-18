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

  allProjects: any[] = [];     
  projects: any[] = [];         
  semesters: any[] = [];        
  selectedSemester: number | null = null; 

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    // 1. Cargar Proyectos
    this.projectService.getProjects().subscribe(data => {
      this.allProjects = data;
      this.projects = data; 
    });

    // 2. Cargar Semestres para los botones
    this.projectService.getSemesters().subscribe(data => {
      this.semesters = data.sort((a: any, b: any) => {
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      });
    });
  }

  // 3. Función para filtrar
  filterBySemester(semesterId: number | null) {
    this.selectedSemester = semesterId;

    if (semesterId === null) {
      this.projects = this.allProjects; 
    } else {
      this.projects = this.allProjects.filter(p => p.semester_id === semesterId);
    }
  }


}