import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import RegistroComponent from '../registro/registro.component';
import PricePlanComponent from '../../shared/price-plan/price-plan.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RegistroComponent,
    RouterModule,
    PricePlanComponent
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css',
})
export default class PrincipalComponent {
  private el = inject(ElementRef)
  private _router = inject(Router);
  items = [
    { id: 1, name: 'Evaluar su nivel de preparación.' },
    { id: 2, name: 'Mejorar su rendimiento durante la prueba.' },
    { id: 3, name: 'Reducir el estrés y la ansiedad antes del examen' },
    { id: 4, name: 'Familiarizarse con el formato y la estructura del examen.' },
    { id: 5, name: 'Identificar áreas de mejora y fortaleza en su conocimiento.' },
  ];


  scrollToRegistro() {
    const registroElement = this.el.nativeElement.querySelector('app-registro');
    registroElement.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToPlanes() {
    const registroElement = this.el.nativeElement.querySelector('app-price-plan');
    registroElement.scrollIntoView({ behavior: 'smooth' });
  }

  redireccionarLogin(){
    this._router.navigateByUrl('/auth')
  }
}
