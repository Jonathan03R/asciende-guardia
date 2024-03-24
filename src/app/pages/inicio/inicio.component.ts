import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import ExamenRealComponent from '../../examenes/ExamenReal/ExamenReal.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    ExamenRealComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export default class InicioComponent {
  private _router = inject(Router);
  examenReal: boolean = true;
  redirectToPractica() {
    if(this.examenReal){
      this.examenReal= false;
    }
  }

  items = [
    { id: 1, name: 'Evaluar su nivel de preparación.' },
    { id: 2, name: 'Mejorar su rendimiento durante la prueba.' },
    { id: 3, name: 'Reducir el estrés y la ansiedad antes del examen' },
    { id: 4, name: 'Familiarizarse con el formato y la estructura del examen.' },
    { id: 5, name: 'Identificar áreas de mejora y fortaleza en su conocimiento.' },
  ];
}
