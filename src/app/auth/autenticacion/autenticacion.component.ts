import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {  AngularFireAuthModule } from '@angular/fire/compat/auth'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass, NgOptimizedImage } from '@angular/common';
import { AuthService, Credential } from '../../services/auth.service';
import { AlertasService } from '../../services/alertas.service';
import SpinnerComponent from '../../shared/spinner/spinner.component';

interface SignUpForm {
  names: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  repetirPassword: FormControl<string>;

}

interface LogInForm {
  emailLogin: FormControl<string>;
  passwordLogin: FormControl<string>;
}




@Component({
  selector: 'app-autenticacion',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    RouterOutlet,
    NgClass,
    AngularFireAuthModule,
    SpinnerComponent
  ],
  templateUrl: './autenticacion.component.html',
  styleUrl: './autenticacion.component.css'
})
export default class AutenticacionComponent implements OnInit {
  public spinner: boolean = false;

  formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private _router = inject(Router);
  private alert = inject(AlertasService);

  ngOnInit(): void {
    this.authService.spinner$.subscribe(state => {
      this.spinner = state;
    });
  }

  formRegister: FormGroup<SignUpForm> = this.formBuilder.group({
    names: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    repetirPassword: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  formLogin: FormGroup<LogInForm> = this.formBuilder.group({
    emailLogin: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    passwordLogin: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  // logica para cambiar de pantalla en la pantalla para registrarse y loguearse
  isSignUpMode: boolean = false;

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  // logica para registrar

  async registrar(): Promise<void> {

    
    const contraseña = this.formRegister.value.password;
    const repetirContraseña = this.formRegister.value.repetirPassword;

    if (contraseña !== repetirContraseña) {
      alert('las contraseñas no son iguales -_-');
      return;
    }
    this.spinner = true;
    const credential: Credential = {
      email: this.formRegister.value.email || '',
      password: this.formRegister.value.password || '',
    };

    if (this.formRegister.invalid) return;

    await this.authService.sigUpWidthEmailAndPassword(credential);
    
  }


  //logica para el login
  async logearse() {
    

    const credential: Credential = {
      email: this.formLogin.value.emailLogin || '',
      password: this.formLogin.value.passwordLogin || '',
    };
    if (this.formLogin.invalid) return;
    try {
      await this.authService.logInWhithEmailAndPassword(credential);
      
    } catch (error: any) {
      this.alert.MensajeDeError(error.code);
      
      
    }
  }


  async signUpWithGoogle(): Promise<void>{
    try {
      const result = await this.authService.signInWithGoogleProvider();
      // aqui tiene que ir el mensaje

      this._router.navigateByUrl('/cargando');
      console.log(result);
    } catch (error) {
      console.log(error);
      
    }
  }




}
