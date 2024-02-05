// Servicio de Autenticación para Angular
// Este código implementa funciones relacionadas con la autenticación, como registro, inicio de sesión y cierre de sesión, 
// junto con la verificación de correo electrónico y el rastreo de inactividad.

import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  authState,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  AuthProvider
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertasService } from './alertas.service';
import { BehaviorSubject } from 'rxjs';

export interface Credential {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Observable para controlar el estado del spinner
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  public spinner$ = this.spinnerSubject.asObservable();

  // Inyección de dependencias
  private auth: Auth = inject(Auth);
  private _router = inject(Router);
  alert = inject(AlertasService)

  // Configuración para el rastreo de inactividad
  private inactivityTimeout: number = 60 * 60 * 1000;
  private lastActivityTime: number = Date.now();

  // Método para manejar la actividad del usuario
  handleUserActivity(): void {
    this.lastActivityTime = Date.now();
  }

  // Método para configurar el rastreo de inactividad
  setupInactivityTracking(): void {
    this.authState$.subscribe((user) => {
      if (user) {
        document.addEventListener('mousemove', () => this.handleUserActivity());
        document.addEventListener('keydown', () => this.handleUserActivity());

        setInterval(() => {
          const currentTime = Date.now();
          const inactiveTime = currentTime - this.lastActivityTime;

          if (inactiveTime >= this.inactivityTimeout) {
            this.logOut().then(() => {
              this.alert.AlertaPersonalizadatres();
            });
          }
        }, 600000);
      }
    });
  }

  // Método para iniciar el spinner
  startSpinner(): void {
    this.spinnerSubject.next(true);
  }

  // Método para detener el spinner
  stopSpinner(): void {
    this.spinnerSubject.next(false);
  }

  readonly authState$ = authState(this.auth);

  /**
   * Registra a un usuario con correo y contraseña.
   * @param credential - Credenciales del usuario (correo y contraseña).
   * @returns Resultado de la operación de registro.
   */
  async sigUpWidthEmailAndPassword(credential: Credential): Promise<UserCredential | void> {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        credential.email,
        credential.password
      );
      await this.sendEmailVerification();
      this._router.navigateByUrl('/v-r')
      return result;
    } catch (error: any) {
      this.stopSpinner();
      this.alert.MensajeDeError(error);
      return console.log(error);
    }
  }

  /**
   * Inicia sesión con correo y contraseña.
   * @param credential - Credenciales del usuario (correo y contraseña).
   * @returns Resultado de la operación de inicio de sesión.
   */
  async logInWhithEmailAndPassword(credential: Credential): Promise<UserCredential | void> {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        credential.email,
        credential.password
      );

      if (result.user && !result.user.emailVerified) {
        await this.sendEmailVerification();
        this.alert.AlertaPersonalizada('error', 'Cuenta No Verificada', 'Revise su correo para su verificación');
        await this.logOut();
        this._router.navigateByUrl('/');
        return;
      } else {
        this._router.navigateByUrl('/cargando');
      }
      return result;
    } catch (error: any) {
      this.alert.MensajeDeError(error);
      return console.log(error);
    }
  }

  // Método para cerrar sesión
  logOut(): Promise<void> {
    return this.auth.signOut();
  }

  // Método para iniciar sesión con Google
  signInWithGoogleProvider(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return this.callPopUp(provider);
  }

  /**
   * Realiza el popup de autenticación.
   * @param provider - Proveedor de autenticación.
   * @returns Resultado de la operación de autenticación.
   */
  async callPopUp(provider: AuthProvider): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  // Método para enviar verificación de correo electrónico
  sendEmailVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      return sendEmailVerification(user);
    }
    return Promise.reject(new Error('No se pudo encontrar el usuario actual.'));
  }

  // Método para verificar el estado de la verificación
  EstadoDeVerificacion(): Promise<void> {
    const user = this.auth.currentUser;
    if (user?.emailVerified) {
      this._router.navigateByUrl('/cargando')
    } else {
      this._router.navigateByUrl('/auth')
    }
    return Promise.reject(new Error('No se pudo encontrar el usuario actual.'));
  }
}
