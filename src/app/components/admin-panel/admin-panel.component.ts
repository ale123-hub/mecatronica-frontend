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
  shifts: any[] = [];
  allProjects: any[] = [];
  teachers: any[] = [];
  students: any[] = [];

  selectedTeacherIds: number[] = [];
  selectedStudentIds: number[] = [];

  isEditing = false;
  currentProjectId: number | null = null;

  projectForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    semester_id: new FormControl('', [Validators.required]),
    shift_id: new FormControl('', [Validators.required])
  });

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadProjects();
  }

  // --- CARGA DE DATOS ---

  loadInitialData() {
    this.projectService.getSemesters().subscribe({
      next: (data) => this.semesters = data.sort((a, b) => a.id - b.id),
      error: (err) => console.error('Error semestres', err)
    });

    this.projectService.getShifts().subscribe({
      next: (data) => this.shifts = data.sort((a, b) => a.id - b.id),
      error: (err) => console.error('Error turnos', err)
    });

    this.projectService.getTeachers().subscribe(data => this.teachers = data);
    this.projectService.getStudents().subscribe(data => this.students = data);
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(data => this.allProjects = data);
  }

  // --- GESTIÓN DE FORMULARIO ---

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onTeacherChange(event: any, id: number) {
    if (event.target.checked) this.selectedTeacherIds.push(id);
    else this.selectedTeacherIds = this.selectedTeacherIds.filter(tid => tid !== id);
  }

  onStudentChange(event: any, id: number) {
    if (event.target.checked) this.selectedStudentIds.push(id);
    else this.selectedStudentIds = this.selectedStudentIds.filter(sid => sid !== id);
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.projectForm.value.title ?? '');
    formData.append('description', this.projectForm.value.description ?? '');
    formData.append('semester_id', this.projectForm.value.semester_id ?? '');
    formData.append('shift_id', this.projectForm.value.shift_id ?? '');
    formData.append('teacher_ids', JSON.stringify(this.selectedTeacherIds));
    formData.append('student_ids', JSON.stringify(this.selectedStudentIds));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Si es edición, agregamos el truco del _method para Laravel
    if (this.isEditing && this.currentProjectId) {
      formData.append('_method', 'PUT'); 
      
      this.projectService.updateProject(this.currentProjectId, formData).subscribe({
        next: () => {
          alert('¡Proyecto actualizado!');
          this.resetForm();
          this.loadProjects();
        },
        error: (err) => alert('Error al actualizar: ' + (err.error?.message || 'Error desconocido'))
      });
    } else {
      this.projectService.createProject(formData).subscribe({
        next: () => {
          alert('¡Proyecto creado!');
          this.resetForm();
          this.loadProjects();
        },
        error: (err) => alert('Error al crear: ' + (err.error?.message || 'Error desconocido'))
      });
    }
  }

  // --- ACCIONES ---

  onEdit(project: any) {
    this.isEditing = true;
    this.currentProjectId = project.id;
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      semester_id: project.semester_id,
      shift_id: project.shift_id
    });
    this.selectedTeacherIds = project.teachers?.map((t: any) => t.id) || [];
    this.selectedStudentIds = project.students?.map((s: any) => s.id) || [];
    this.imagePreview = project.image ? `http://127.0.0.1:8000/storage/${project.image}` : null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          alert('Eliminado correctamente');
          this.loadProjects();
        },
        error: (err) => alert('Error al eliminar')
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.isEditing = false;
    this.currentProjectId = null;
    this.selectedTeacherIds = [];
    this.selectedStudentIds = [];
    this.projectForm.reset({ semester_id: '', shift_id: '' });
    this.selectedFile = null;
    this.imagePreview = null;
  }

  logout() {
    localStorage.removeItem('admin_token');
    this.router.navigate(['/login']);
  }
}