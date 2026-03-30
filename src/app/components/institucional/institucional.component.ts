import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- ESTO ES VITAL

@Component({
  selector: 'app-institucional',
  standalone: true,
  imports: [CommonModule, RouterModule], // <--- DEBE ESTAR AQUÍ
  templateUrl: './institucional.component.html',
  styleUrl: './institucional.component.css'
})
export class InstitucionalComponent { }