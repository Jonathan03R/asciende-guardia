import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../../app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {

  constructor(private http: HttpClient) { }


  enviarRespuestaUsuario(usuarioId: number, examenId: number, preguntaId: number, respuestaSeleccionada: string): Observable<any> {
    const endpoint = `${BASE_URL}/examen/respuesta-usuario`;
    const body = {
      usuarioId,
      examenId,
      preguntaId,
      respuestaSeleccionada
    };
    return this.http.post(endpoint, body);
  }
}
