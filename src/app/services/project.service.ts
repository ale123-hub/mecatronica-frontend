import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL base para no repetir

  constructor(private http: HttpClient) { }

  // Obtener proyectos (Público)
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  // Crear proyecto (Privado - El Interceptor pondrá el Token)
  createProject(formData: FormData): Observable<any> {
    // IMPORTANTE: No añadimos Headers aquí. 
    // El navegador configurará el 'multipart/form-data' automáticamente.
    return this.http.post(`${this.apiUrl}/projects`, formData);
  }

  //Asignar Profesores a los Proyectos  
  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teachers`);
  }
  //Asignar estudiantes
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students`);
  }

  // Eliminar un proyecto
  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`);
  }

  // Obtener un solo proyecto (para cargar los datos al editar)
  getProject(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/projects/${id}`);
  }

  // Actualizar proyecto (usamos POST con _method=PUT por limitaciones de FormData en PHP)
  updateProject(id: number, formData: FormData): Observable<any> {
  formData.append('_method', 'PUT'); 
  return this.http.post(`${this.apiUrl}/projects/${id}`, formData);
}

  // Auxiliares para el formulario
  getSemesters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/semesters`);
  }

  getShifts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/shifts`);
  }
}