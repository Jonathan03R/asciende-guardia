import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-pantalla-carga',
  standalone: true,
  imports: [
    RouterModule],
  templateUrl: './pantalla-carga.component.html',
  styleUrl: './pantalla-carga.component.css'
})
export default class PantallaCargaComponent implements OnInit{
  private _router = inject(Router);
  ngOnInit(): void {
    
    gsap.fromTo(".loading-page", { opacity: 1 }, {
      opacity: 0, 
      display: "none",
      duration: 0.5,
      delay: 1.5,
      onComplete: () => {
        // Redirigir al componente de login al finalizar la animación
        this._router.navigateByUrl('/dash');
      }
    });

    gsap.fromTo(".logo-name", { y: 50, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      delay: 0.5,
    });
    
  }
}
