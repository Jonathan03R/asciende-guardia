import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass, NgOptimizedImage } from '@angular/common';
import { AuthService, Credential } from '../../services/auth.service';
import { AlertasService } from '../../services/alertas.service';
import SpinnerComponent from '../../shared/spinner/spinner.component';
import { BackendUserService } from '../../services/serviciosBackend/backendUser.service';


// DEFINICION DE INTERFACES PARA LOS FORMULARIOS
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

  // Propiedad para controlar la visibilidad del spinner
  public spinner: boolean = false;

  formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private backendUser = inject(BackendUserService);

  private _router = inject(Router);
  private alert = inject(AlertasService);
  //metodo para registrar usuario a la base de ddatos sql 

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
  private signInWithGoogleClicked: boolean = false;

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  // logica para registrar

  async registrar(): Promise<void> {

    if (
      !this.formRegister.value.names ||
      !this.formRegister.value.email ||
      !this.formRegister.value.password ||
      !this.formRegister.value.repetirPassword
    ) {
      
      this.alert.alertasPersonalizadas('Por favor, completa todos los campos');
      return;
    }
    const contraseña = this.formRegister.value.password;
    const repetirContraseña = this.formRegister.value.repetirPassword;

    if (contraseña !== repetirContraseña) {
      this.alert.alertasPersonalizadas('las contraseñas no son iguales 🤡');
      
      return;
    }

    const credential: Credential = {
      email: this.formRegister.value.email || '',
      password: this.formRegister.value.password || '',
    };

    if (this.formRegister.invalid) return;
    this.registrarUsuario();
    await this.authService.sigUpWidthEmailAndPassword(credential);

  }


  //logica para el login
  async logearse() {
    // Evitar la acción predeterminada del formulario cuando se hace clic en el botón de Google
    if (this.signInWithGoogleClicked) {
      // Si se hizo clic en el botón de Google, cancelar la ejecución
      this.signInWithGoogleClicked = false;
      return;
    }
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


  async signUpWithGoogle(): Promise<void> {
    try {
      this.signInWithGoogleClicked = true;
      const result = await this.authService.signInWithGoogleProvider();

      this._router.navigateByUrl('/cargando');
      console.log(result);
    } catch (error) {
      console.log(error);

    }
  }

  //****************************** IMPLENETACION DEL BACKEND **********************************************************
  registrarUsuario(): void {
    // Llama al método registerUser del servicio BackendUserService
    const userData = {
      usuario_nombre: this.formRegister.value.names,
      usuario_correo: this.formRegister.value.email,
      // Aquí puedes agregar más campos si es necesario
    };

    this.backendUser.registerUser(userData).subscribe(
      response => {
        // Maneja la respuesta del servidor después de registrar al usuario
        console.log('Usuario registrado exitosamente');
      },
      error => {
        // Maneja cualquier error que ocurra durante la solicitud al servidor
        console.error('Error al registrar usuario:', error);
      }
    );
  }

  




}
