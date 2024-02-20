import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class FireErrorService {

  constructor() { }

  /**
   * Devuelve un mensaje de error personalizado según el código de FirebaseError.
   * @param error - Objeto FirebaseError que contiene detalles sobre el error.
   * @returns Mensaje de error personalizado.
   */
  CodeError(error: FirebaseError): string {
    switch (error.code) {
      case 'auth/weak-password':
        return 'La contraseña es muy débil.';
      case 'auth/invalid-email':
        return 'El correo electrónico es inválido.';
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrecta.';
      case 'auth/email-already-in-use':
        return 'El correo ya existe';
      default:
        return 'Error de autenticación.';
    }
  }
}
