import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router'; // Añadimos NavigationEnd
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators'; // Para detectar el cambio de ruta real

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentUrl: string = '';

constructor(private router: Router) {
    // Detectar la URL inicial antes de que ocurra el primer evento NavigationEnd
    this.currentUrl = window.location.pathname; 

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects;
    });
}

  showFooter(): boolean {
    // LISTA BLANCA: Solo estas rutas muestran el footer
    // '' es la principal, '/proyectos' es la galería
    const allowedRoutes = ['/', '/proyectos'];
    return allowedRoutes.includes(this.currentUrl);
  }
}