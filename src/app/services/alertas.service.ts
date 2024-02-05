import { Injectable, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { FireErrorService } from './FireError.service';
import { Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';


@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  constructor(private firebaseError: FireErrorService) {}
  private _router = inject(Router);
    
  MensajeDeError(error: FirebaseError) {

    console.log('Error Code:', error.code);
    // mensaje de error cuando se hace muchos intentos 
    if (error.code === 'auth/too-many-requests') {
      this.AlertaPersonalizada(
        "error",
        " Demasiados intentos",
        "Hemos detectado un número inusual de solicitudes desde este dispositivo. Por favor, inténtalo nuevamente más tarde."
        );
    
    }if(error.code === 'auth/email-already-in-use'){
      this.AlertaPersonalizada(
        "error",
        "Usuario existente",
        "Hemos detectado que este correo ya existe , ingrese un correo correcto"
        );
    } else {
      alert(this.firebaseError.CodeError(error))

    }
  }
  
  public AlertaPersonalizada(icon: 'success' | 'error' | 'info', title: string, text: string) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  public AlertaPersonalizadaDos() {
    Swal.fire({
      title: "Verificación de correo",
      icon: "info",
      text: "Le enviamos un correo para su verificación",
      
      confirmButtonText: 'Verificar'
    }).then((result) => {
        if (result.isConfirmed) {
            
            window.open('https://www.gmail.com', '_blank');
            this._router.navigateByUrl('/auth');
        }
    });
  }

  public AlertaPersonalizadatres() {
    Swal.fire({
      title: "Tiempo Excedido",
      icon: "info",
      text: "El tiempo permitido ha sido excedido. Por favor, inicie sesión nuevamente.",
      
      confirmButtonText: 'ok'
    }).then((result) => {
        if (result.isConfirmed) {;
            this._router.navigateByUrl('/auth');
        }
    });
  }

  

}
