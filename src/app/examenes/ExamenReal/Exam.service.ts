import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExamenRealService {

  constructor() { }

  /**
   * Convierte el tiempo en segundos a un formato de hora, minutos y segundos.
   * @param seconds El tiempo en segundos.
   * @returns El tiempo formateado en formato HH:mm:ss.
   */
  convertSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.formatTimeUnit(hours)}:${this.formatTimeUnit(minutes)}:${this.formatTimeUnit(remainingSeconds)}`;
  }

  /**
   * Formatea una unidad de tiempo (hora, minuto o segundo) a dos dígitos.
   * @param unit La unidad de tiempo a formatear.
   * @returns La unidad de tiempo formateada como una cadena de dos dígitos.
   */
  private formatTimeUnit(unit: number): string {
    return unit < 10 ? `0${unit}` : `${unit}`;
  }

  /**
   * Calcula las respuestas seleccionadas por el usuario en el examen y las devuelve en un array de cadenas.
   * @param selectedAnswers Un array que contiene las respuestas seleccionadas por el usuario.
   * @returns Un array de cadenas que representan las respuestas seleccionadas en el formato "nLetra", donde 'n' es el número de pregunta y 'Letra' es la letra de la respuesta seleccionada.
   */
  calcularRespuestasSeleccionadas(selectedAnswers: (string | null)[]): string[] {
    const respuestasSeleccionadas: string[] = [];
    for (let i = 0; i < selectedAnswers.length; i++) {
      const answer = selectedAnswers[i];
      if (answer) {
        let letra = '';
        switch (answer) {
          case 'option1':
            letra = 'A';
            break;
          case 'option2':
            letra = 'B';
            break;
          case 'option3':
            letra = 'C';
            break;
          case 'option4':
            letra = 'D';
            break;
          default:
            letra = '';
        }
        const respuesta = (i + 1) + letra;
        if (respuestasSeleccionadas.length === 0) {
          respuestasSeleccionadas.push(respuesta);
        } else {
          respuestasSeleccionadas.push(', ' + respuesta);
        }
      }
    }
    return respuestasSeleccionadas;
  }
}
