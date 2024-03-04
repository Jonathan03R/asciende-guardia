import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-examen-real',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './ExamenReal.component.html',
  styleUrl: './ExamenReal.component.css',
})
export default class ExamenRealComponent {
  numeros: number[] = Array.from({ length: 100 }, (_, index) => index + 1);
}
