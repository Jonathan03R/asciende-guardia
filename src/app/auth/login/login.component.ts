import { CommonModule, NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AlertasService } from '../../services/alertas.service';
import { AuthService , Credential} from '../../services/auth.service';
import { BackendUserService } from '../../services/serviciosBackend/backendUser.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import SpinnerComponent from '../../shared/spinner/spinner.component';

interface LogInForm {
  emailLogin: FormControl<string>;
  passwordLogin: FormControl<string>;
}


@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent { 

  formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private backendUser = inject(BackendUserService);

  private _router = inject(Router);
  private alert = inject(AlertasService);


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

  async logearse() {
   
    const emailLogin = this.formLogin.value.emailLogin;
    const passwordLogin = this.formLogin.value.passwordLogin;



    if (!emailLogin) {
      this.alert.alertasPersonalizadas('Por favor, ingresa un correo electrónico válido.');
      
      return;
    }

    const usuario_correo = emailLogin;
    
    if (!passwordLogin) {
      this.alert.alertasPersonalizadas('Por favor, ingresa tu contraseña.');
      return;
    }
    const credential: Credential = {
      email: emailLogin,
      password: passwordLogin,
    };

    if (this.formLogin.invalid) return;

    try {
      await this.authService.logInWhithEmailAndPassword(credential);
      this.backendUser.getUserInfo(usuario_correo).subscribe(userInfo => {
        // Aquí puedes manejar la información del usuario recibida lo que tiene la base de datos sql
        console.log('Información del usuario:', userInfo);
      });
    } catch (error: any) {
      console.log(error)
      this.alert.alertasFireBase(error.code);
    }
  }
}
