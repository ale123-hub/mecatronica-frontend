import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  
  semesters: any[] = []; 
  shifts: any[] = []; // Los turnos que traeremos de la DB

  projectForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    semester_id: new FormControl('', [Validators.required]), 
    shift_id: new FormControl('', [Validators.required]) // Lo dejamos vacío para que obligue a elegir
  });

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    // 1. Cargamos Semestres
    this.projectService.getSemesters().subscribe({
      next: (data) => this.semesters = data,
      error: (err) => console.error('Error cargando semestres', err)
    });

    // 2. Cargamos Turnos
    this.projectService.getShifts().subscribe({
      next: (data) => this.shifts = data,
      error: (err) => console.error('Error cargando turnos', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.projectForm.value.title ?? '');
    formData.append('description', this.projectForm.value.description ?? '');
    formData.append('semester_id', this.projectForm.value.semester_id ?? '');
    formData.append('shift_id', this.projectForm.value.shift_id ?? '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.projectService.createProject(formData).subscribe({
      next: () => {
        alert('¡Proyecto guardado con éxito!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Detalle del error:', err);
        // Si el error es 422, Laravel nos dirá qué campo falló exactamente
        const msg = err.error?.message || 'Error de validación';
        alert('Error: ' + msg);
      }
    });
  }
}