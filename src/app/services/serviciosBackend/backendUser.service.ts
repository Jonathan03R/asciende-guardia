import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { BASE_URL } from '../../app.config'; 
@Injectable({
  providedIn: 'root'
})
export class BackendUserService {
  // private baseUrl = 'http://localhost:8080';
  constructor(private http:HttpClient) { }

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
