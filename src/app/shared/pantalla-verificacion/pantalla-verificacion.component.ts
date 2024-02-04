import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import SpinnerComponent from '../spinner/spinner.component';

@Component({
  selector: 'app-pantalla-verificacion',
  standalone: true,
  imports: [RouterModule, SpinnerComponent],
  templateUrl: './pantalla-verificacion.component.html',
  styleUrl: './pantalla-verificacion.component.css'
})
export default class PantallaVerificacionComponent {
  private _router = inject(Router)
  private authService = inject(AuthService)
  
  public spinner: boolean = true

  


  redireccionar(){
    this.spinner = false;
    
    setTimeout(() => {
      this.authService.EstadoDeVerificacion();
    }, 1000);
  }
  
}
