import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    // La URL de tu API de Laravel (Backend)
    private apiUrl = 'http://127.0.0.1:8000/api/projects';

    constructor(private http: HttpClient) { }

    getProjects(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    createProject(formData: FormData): Observable<any> {
        return this.http.post(this.apiUrl, formData);
    }
  
    getSemesters(): Observable<any[]> {
        return this.http.get<any[]>('http://127.0.0.1:8000/api/semesters');
    }

    getShifts(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/shifts');
    }
}