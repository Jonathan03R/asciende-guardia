import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class FireErrorService {

  constructor() { }
  CodeError(error: FirebaseError): string {
    switch (error.code) {
      case 'auth/weak-password':
        return 'La contraseña es muy debil'
      case 'auth/invalid-email':
        return 'El correo es invalido'
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrecta'
      default:
        return 'Error de autenticacion'
    }
  }
}
