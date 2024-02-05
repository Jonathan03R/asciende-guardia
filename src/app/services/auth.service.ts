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


  private spinnerSubject = new BehaviorSubject<boolean>(false);
  public spinner$ = this.spinnerSubject.asObservable();

  private auth: Auth = inject(Auth);
  private _router = inject(Router);
  alert = inject(AlertasService)

  private inactivityTimeout: number = 10 * 60 * 1000; 
  private lastActivityTime: number = Date.now();

  handleUserActivity(): void {
    this.lastActivityTime = Date.now();
  }

  // Método para configurar el rastreo de inactividad
  setupInactivityTracking(): void {
    // Verificar si el usuario está autenticado
    this.authState$.subscribe((user) => {
      if (user) {
        // Detectar actividad del usuario dentro de la aplicación
        document.addEventListener('mousemove', () => this.handleUserActivity());
        document.addEventListener('keydown', () => this.handleUserActivity());
  
        // Verificar inactividad en intervalos regulares
        setInterval(() => {
          const currentTime = Date.now();
          const inactiveTime = currentTime - this.lastActivityTime;
  
          if (inactiveTime >= this.inactivityTimeout) {
            // Usuario inactivo por mucho tiempo, cerrar sesión
            this.logOut().then(() => {
              this.alert.AlertaPersonalizadatres();
            });
          }
        }, 600000); // Verificar cada minuto
      }
    });
  }


  startSpinner(): void {
    this.spinnerSubject.next(true);
  }

  stopSpinner(): void {
    this.spinnerSubject.next(false);
  }

  readonly authState$ = authState(this.auth);
 



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


  // logica para el login
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


  logOut(): Promise<void> {
    return this.auth.signOut();
  }


  // logearse con google 

  signInWithGoogleProvider(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();

    return this.callPopUp(provider);
  }

  async callPopUp(provider: AuthProvider): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  sendEmailVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      return sendEmailVerification(user);
    }
    return Promise.reject(new Error('No se pudo encontrar el usuario actual.'));
  }


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
