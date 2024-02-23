import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { BASE_URL } from '../../app.config';
/**
 * Servicio para interactuar con el backend relacionado con la gestión de usuarios.
 * Proporciona métodos para registrar usuarios, obtener información de usuario, y manejar errores de la API.
 */

@Injectable({
  providedIn: 'root'
})
export class BackendUserService {
  // private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  /**
  * Registra un nuevo usuario en el backend.
  * @param userData - Datos del usuario a registrar.
  * @returns Un observable que emite la respuesta del servidor.
  */

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/user/register`, userData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido';
          if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Error del servidor
            errorMessage = `Error del servidor: ${error.status}. Mensaje: ${error.message}`;
          }
          console.error(errorMessage);
          return throwError(errorMessage);
        })
      );
  }

  /**
   * Obtiene información de usuario desde el backend.
   * @param usuario_correo - Correo del usuario del que se desea obtener la información.
   * @returns Un observable que emite la respuesta del servidor.
   */

  getUserInfo(usuario_correo: string): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/user/userinfo`, { usuario_correo })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido';
          if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Error del servidor
            errorMessage = `Error del servidor: ${error.status}. Mensaje: ${error.message}`;
          }
          console.error(errorMessage);
          return throwError(errorMessage);
        })
      );
  }

}
