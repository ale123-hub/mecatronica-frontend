import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {

  // Áreas consistentes con el componente de la lista
  categories = ['Robótica', 'Automatización', 'Electrónica', 'Mecanismos', 'Software Industrial'];

  semesters: any[] = [];
  shifts: any[] = [];
  allProjects: any[] = [];
  teachers: any[] = [];
  students: any[] = [];

  selectedTeacherIds: (number | string)[] = [];
  selectedStudentIds: (number | string)[] = [];
  newAddedStudents: string[] = [];
  newAddedTeachers: string[] = [];

  isEditing = false;
  currentProjectId: number | null = null;

  // Corregido: Coma faltante después de shift_id y validación de category
  projectForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    semester_id: new FormControl('', [Validators.required]),
    shift_id: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required])
  });

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadInitialData();
    this.loadProjects();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir explícitamente tras logout
  }

  // --- GESTIÓN DE MIEMBROS DINÁMICOS ---
  addMember(type: 'student' | 'teacher', name: string) {
    if (!name.trim()) return;

    // EXPRESIÓN REGULAR: Solo permite letras, espacios y tildes. 
    // No permite números ni caracteres especiales extraños.
    const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!soloLetrasRegex.test(name)) {
      alert('⚠️ Error: El nombre solo debe contener letras. No se permiten números ni símbolos.');
      return; // Detiene la ejecución para que no se agregue
    }

    // Si pasa la validación, sigue tu lógica normal
    if (type === 'student') {
      if (!this.selectedStudentIds.includes(name)) {
        this.newAddedStudents.push(name);
        this.selectedStudentIds.push(name);
      }
    } else {
      if (!this.selectedTeacherIds.includes(name)) {
        this.newAddedTeachers.push(name);
        this.selectedTeacherIds.push(name);
      }
    }
  }


  removeNewName(type: 'student' | 'teacher', name: string) {
    if (type === 'student') {
      this.newAddedStudents = this.newAddedStudents.filter(n => n !== name);
      this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== name);
    } else {
      this.newAddedTeachers = this.newAddedTeachers.filter(n => n !== name);
      this.selectedTeacherIds = this.selectedTeacherIds.filter(id => id !== name);
    }
  }

  // --- CARGA DE DATOS ---
  loadInitialData() {
    this.projectService.getSemesters().subscribe({
      next: (data) => this.semesters = data.sort((a: any, b: any) => a.id - b.id),
      error: (err) => this.handleServiceError('cargar semestres', err)
    });

    this.projectService.getShifts().subscribe({
      next: (data) => this.shifts = data.sort((a: any, b: any) => a.id - b.id),
      error: (err) => this.handleServiceError('cargar turnos', err)
    });

    this.projectService.getTeachers().subscribe({
      next: (data) => this.teachers = data,
      error: (err) => this.handleServiceError('cargar profesores', err)
    });

    this.projectService.getStudents().subscribe({
      next: (data) => this.students = data,
      error: (err) => this.handleServiceError('cargar estudiantes', err)
    });
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => this.allProjects = data,
      error: (err) => this.handleServiceError('cargar proyectos', err)
    });
  }

  // --- GESTIÓN DE FORMULARIO ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // NUEVO: Validar tamaño (2MB = 2097152 bytes)
      if (file.size > 2097152) {
        alert('⚠️ La imagen es muy pesada. El límite es 2MB para asegurar la subida.');
        event.target.value = ''; // Limpia el input
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  // Utilizar includes para marcar checkboxes en el HTML
  isTeacherSelected(id: number): boolean {
    return this.selectedTeacherIds.includes(id);
  }

  isStudentSelected(id: number): boolean {
    return this.selectedStudentIds.includes(id);
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
    formData.append('category', this.projectForm.value.category ?? ''); // Agregado

    formData.append('student_ids', JSON.stringify(this.selectedStudentIds));
    formData.append('teacher_ids', JSON.stringify(this.selectedTeacherIds));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

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
    this.resetForm();
    this.isEditing = true;
    this.currentProjectId = project.id;

    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      semester_id: project.semester_id,
      shift_id: project.shift_id,
      category: project.category // Cargar categoría al editar
    });

    this.selectedTeacherIds = project.teachers?.map((t: any) => t.id) || [];
    this.selectedStudentIds = project.students?.map((s: any) => s.id) || [];

    //this.imagePreview = project.image ? `https://mecatronica-backend.onrender.com/storage/${project.image}` : null;
    this.imagePreview = project.image ? project.image : null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          alert('Eliminado correctamente');
          this.loadProjects();
        },
        error: (err) => this.handleServiceError('eliminar el proyecto', err)
      });
    }
  }

  resetForm() {
    this.isEditing = false;
    this.currentProjectId = null;
    this.selectedTeacherIds = [];
    this.selectedStudentIds = [];
    this.newAddedStudents = [];
    this.newAddedTeachers = [];
    this.projectForm.reset({ semester_id: '', shift_id: '', category: '' });
    this.selectedFile = null;
    this.imagePreview = null;
  }

  private handleServiceError(action: string, err: any) {
    console.error(`Error al ${action}:`, err);
    if (err.status === 401) {
      alert('Tu sesión ha caducado. Ingresa de nuevo.');
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      const msg = err.error?.message || 'Revisa la conexión con el servidor.';
      alert(`Error al ${action}: ${msg}`);
    }
  }
}