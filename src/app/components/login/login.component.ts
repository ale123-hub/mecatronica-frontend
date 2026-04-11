import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router'; // <--- Agregamos RouterModule
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // <--- Lo incluimos aquí
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login() {
    console.log('Enviando datos:', this.credentials);

    // Los headers DEBEN ir aquí adentro para que se envíen en cada clic
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    this.http.post('http://127.0.0.1:8000/api/login', this.credentials, { headers }).subscribe({
      next: (res: any) => {
        console.log('¡Login exitoso!', res);
        localStorage.setItem('token', res.access_token);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Error detallado:', err);
        if (err.status === 401) {
          alert('Credenciales incorrectas (Usuario o Clave mal)');
        } else if (err.status === 405) {
          alert('Error 405: El servidor rechaza el método POST. Revisa las rutas del Back.');
        } else {
          alert('Error al conectar con el servidor (Estatus: ' + err.status + ')');
        }
      }
    });
  }
}