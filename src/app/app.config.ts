import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Detección de cambios optimizada
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2. Configuración de Rutas
    provideRouter(routes),

    // 3. Configuración ÚNICA del Cliente HTTP con el Interceptor
    provideHttpClient(
      withInterceptors([authInterceptor]) 
    )
  ]
};