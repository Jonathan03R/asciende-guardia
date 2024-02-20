import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertasService } from '../../services/alertas.service';
import { AuthService, Credential } from '../../services/auth.service';
import { BackendUserService } from '../../services/serviciosBackend/backendUser.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

interface SignUpForm {
  names: FormControl<string>;
  lastNames: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  repetirPassword: FormControl<string>;

}



@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    NgOptimizedImage
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export default class RegistroComponent {

  formBuilder = inject(FormBuilder);
  alert = inject(AlertasService);
  private backendUser = inject(BackendUserService);
  private authService = inject(AuthService);

  formRegister: FormGroup<SignUpForm> = this.formBuilder.group({
    names: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),

    lastNames: this.formBuilder.control('', {
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


  private validarLongitudCaracteres(): boolean {
    const password = this.formRegister.value.password;
    if (password) {
      if (password.length < 8 || password.length > 20 || !/^[a-zA-Z0-9]+$/.test(password)) {
        this.alert.alertasPersonalizadas('La contraseña debe tener entre 8 y 20 caracteres y contener solo letras y números.');
        return false;
      }
    }


    return true;
  }

  private validarCoincidenciaContrasenas(): boolean {
    const password = this.formRegister.value.password;
    const confirmPassword = this.formRegister.value.repetirPassword;

    if (password !== confirmPassword) {
      this.alert.alertasPersonalizadas('Las contraseñas no coinciden. Por favor, inténtelo de nuevo.');
      return false;
    }

    return true;
  }

  // Registro del correo y la contraseña para firebase
  async registrar(): Promise<void> {

    if (this.formRegister.invalid) {
      this.alert.alertasPersonalizadas('Por favor, completa todos los campos correctamente');
      return;
    }

    if (!this.validarLongitudCaracteres()) {
      return;
    }

    if (!this.validarCoincidenciaContrasenas()) {
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


  //****************************** IMPLENETACION DEL BACKEND **********************************************************
  registrarUsuario(): void {
    //   // Llama al método registerUser del servicio BackendUserService
    const userData = {
      usuario_nombre: this.formRegister.value.names,
      usuario_correo: this.formRegister.value.email,
      //     // Aquí puedes agregar más campos si es necesario
    };

    this.backendUser.registerUser(userData).subscribe(
      response => {
        //       // Maneja la respuesta del servidor después de registrar al usuario
        console.log('Usuario registrado exitosamente');
      },
      error => {
        //       // Maneja cualquier error que ocurra durante la solicitud al servidor
        console.error('Error al registrar usuario:', error);
      }
    );
  }
}
