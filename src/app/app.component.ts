import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'asciende-guardia-standalone';

  private authService = inject(AuthService);

  ngOnInit(): void {
    // Escuchar el estado de autenticación
    this.authService.authState$.subscribe(user => {
      if (user) {
        // El usuario ha iniciado sesión, reiniciar el temporizador de inactividad
        this.authService.resetInactivityTimer();
      }
    });

    // Iniciar el temporizador de inactividad al cargar la aplicación
    this.authService.startInactivityTimer();
  }
}
