import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../app.config';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }


  getRandomQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/questions/random-questions`);
  }


  getGenerateExamen(userId: number): Observable<any[]> {
    return this.http.post<any[]>(`${BASE_URL}/questions/real-exam`, { userId }).pipe(
      tap(() => console.log('Llamada al servicio de examen exitosa')),
      catchError(error => {
        console.error('Error al llamar al servicio de examen:', error);
        throw error; // Reenviar el error para que sea manejado por el componente que llama al servicio
      })
    );
  }


  checkExamEligibility(userId: number): Observable<any> {
    return this.http.post<any[]>(`${BASE_URL}/questions/check-exam-eligibility`, { userId }) ;
  }

  
  private examen: boolean = true;

  comenzarExamen() {
    this.examen = false;
  }

  reiniciarExamen() {
    this.examen = true;
  }

  obtenerEstadoExamen() {
    return this.examen;
  }
}
