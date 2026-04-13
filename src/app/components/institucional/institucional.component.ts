import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-institucional',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './institucional.component.html',
  styleUrl: './institucional.component.css'
})
export class InstitucionalComponent { }