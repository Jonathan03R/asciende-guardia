import { Injectable } from '@angular/core';
import { BASE_URL } from '../../app.config'; 
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TemasService {

  constructor(private http: HttpClient) { 

  }

  getTemas(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/temas/temas`)
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
