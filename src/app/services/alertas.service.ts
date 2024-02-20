import { Injectable, inject } from '@angular/core';
import { FireErrorService } from './FireError.service';
import { FirebaseError } from '@angular/fire/app';

declare var bootbox: any;

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  errorFirebase = inject(FireErrorService)

  constructor() { }
  alertas(): void {
    bootbox.alert('Se ha acabado el tiempo de espera, por favor, vuelva a iniciar', () => {
      console.log('Alerta de inactividad');
    });
  }

  alertasPersonalizadas(text: string): void {
    bootbox.alert(text, () => {
      console.log('alertaersonalizada')
    });
  }

  // Alerta , Aviso , Personalizado
  alertaPersonalizadas2(title: string, message: string) {
    bootbox.confirm({
      title: title,
      message: message,
      callback: () => {
        // No necesitas hacer nada aquí ya que simplemente quieres cerrar el cuadro de diálogo
      }
    });
  }

  alertaPersonalizadasGmail(title: string, message: string) {
    bootbox.confirm({
      title: title,
      message: message,
      callback: (result: boolean) => {
        if (result) {
          window.open('https://mail.google.com', '_blank');
        }
      }
    });
  }

  alertasFireBase(error: FirebaseError): void {
    const mensaje = this.errorFirebase.CodeError(error); // Obtiene el mensaje de error personalizado usando el método CodeError
    bootbox.alert(mensaje);
  }
}