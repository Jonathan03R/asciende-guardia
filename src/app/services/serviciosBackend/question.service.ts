import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../app.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }


  getRandomQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/questions/random-questions`);
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
