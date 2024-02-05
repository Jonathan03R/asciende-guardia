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

  // Variable privada _router utilizada para navegar entre rutas.
  private _router = inject(Router);

  /**
   * Muestra mensajes de error personalizados según el código de FirebaseError.
   * @param error - Objeto FirebaseError que contiene detalles sobre el error.
   */
  MensajeDeError(error: FirebaseError) {
    console.log('Error Code:', error.code);

    // Mensaje de error para demasiados intentos.
    if (error.code === 'auth/too-many-requests') {
      this.AlertaPersonalizada(
        "error",
        "Demasiados intentos",
        "Hemos detectado un número inusual de solicitudes desde este dispositivo. Por favor, inténtalo nuevamente más tarde."
      );
    } 
    // Mensaje de error para correo electrónico ya en uso.
    else if (error.code === 'auth/email-already-in-use') {
      this.AlertaPersonalizada(
        "error",
        "Usuario existente",
        "Hemos detectado que este correo ya existe, ingrese un correo correcto."
      );
    } 
    // Otros errores se manejan utilizando el servicio de FireError.
    else {
      alert(this.firebaseError.CodeError(error));
    }
  }

  /**
   * Muestra una alerta personalizada con icono, título y texto.
   * @param icon - Tipo de ícono para la alerta (success, error, info).
   * @param title - Título de la alerta.
   * @param text - Texto descriptivo de la alerta.
   */
  public AlertaPersonalizada(icon: 'success' | 'error' | 'info', title: string, text: string) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  /**
   * Muestra una alerta para la verificación de correo electrónico.
   * Abre el enlace de verificación al hacer clic en "Verificar".
   */
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

  /**
   * Muestra una alerta para indicar que el tiempo permitido ha sido excedido.
   * Redirige a la página de autenticación al hacer clic en "ok".
   */
  public AlertaPersonalizadatres() {
    Swal.fire({
      title: "Tiempo Excedido",
      icon: "info",
      text: "El tiempo permitido ha sido excedido. Por favor, inicie sesión nuevamente.",
      
      confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.isConfirmed) {
            this._router.navigateByUrl('/auth');
        }
    });
  }
}
