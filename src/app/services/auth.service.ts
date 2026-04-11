import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Guarda el token al iniciar sesión
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtiene el token para saber si hay sesión activa
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // CIERRE DE SESIÓN REAL
  logout(): void {
    localStorage.clear(); // Borra token y cualquier dato guardado
    
    // Redirige al inicio y reemplaza la URL en el historial 
    // para que "atrás" no funcione hacia el admin
    this.router.navigate(['/'], { replaceUrl: true }).then(() => {
      window.location.reload(); // Opcional: recarga para limpiar estados de memoria
    });
  }

  // Verifica si el usuario está autenticado (usado por el Guard)
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}