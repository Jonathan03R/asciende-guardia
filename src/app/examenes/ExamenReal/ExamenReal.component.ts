import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { QuestionService } from '../../services/serviciosBackend/question.service';
import { FormsModule } from '@angular/forms';
import { UserInfoServiceService } from '../../services/UserInfoService.service';
import { Observable, Subject, Subscription, map, takeUntil, timer } from 'rxjs';
import { ExamenRealService } from './Exam.service';

@Component({
  selector: 'app-examen-real',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ExamenReal.component.html',
  styleUrl: './ExamenReal.component.css',
})
export default class ExamenRealComponent implements OnInit, OnDestroy {

  // Variables para almacenar datos del examen
  questionNumbers: any[] = [];
  questions: any[] = [];
  selectedQuestionIndex: number = 0;
  selectedAnswers: (string | null)[] = [];
  respuestasSeleccionadas: string[] = [];
  public name: string = "";
  politicaSprivacidad: boolean = false;


  

  // Variable para mostrar el tiempo restante en el examen
  displayTime$: Observable<string> | undefined;
  private timerSubscription: Subscription | undefined;


  // Servicios inyectados
  private questionService = inject(QuestionService);
  private userInfoService = inject(UserInfoServiceService);
  private examenRealService = inject(ExamenRealService);

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.getExamQuestions();
    this.inicializarSelectedAnswers();
    this.ordenarRespuestasSeleccionadas();
    this.inicializarUsuario();
  }

  /**
   * Limpia los recursos cuando el componente es destruido.
   */
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  /**
   * Muestra el examen y activa el temporizador.
   */
  mostrarExamen() {
    this.politicaSprivacidad = true;
    this.startTimer();
  }

  // Métodos para el temporizador
  private timeLeft: number = 7200; // Duración en segundos (2 horas)
  private destroy$ = new Subject<void>();

  /**
   * Inicia el temporizador.
   */
  startTimer(): void {
    this.displayTime$ = timer(0, 1000).pipe(
      takeUntil(this.destroy$),
      map(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--; // Reducir el tiempo restante en cada iteración del temporizador
        } else {
          this.stopTimer();
          alert('¡Tiempo terminado!'); // Detener el temporizador cuando el tiempo llega a cero
        }
        return this.examenRealService.convertSecondsToTime(this.timeLeft);
      })
    );
  }

  /**
   * Detiene el temporizador.
   */
  stopTimer(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  /**
   * Muestra una alerta cuando el tiempo termina.
   */
  showAlert(): void {
    alert('¡El tiempo ha expirado!');
  }

  /**
   * Inicializa el nombre de usuario.
   */
  inicializarUsuario() {
    // Obtener la información del usuario del servicio
    const userInfo = this.userInfoService.getUserInfo();
    // Si la información existe y tiene el campo de nombre
    if (userInfo && userInfo.usuario_nombre) {
      this.name = userInfo.usuario_nombre;
    }
  }

  /**
   * Inicializa las respuestas seleccionadas.
   */
  private inicializarSelectedAnswers(): void {
    this.selectedAnswers = Array.from({ length: this.questionNumbers.length }, () => '');
  }

  /**
   * Calcula las respuestas seleccionadas.
   */
  calcularRespuestasSeleccionadas(): void {
    this.respuestasSeleccionadas = this.examenRealService.calcularRespuestasSeleccionadas(this.selectedAnswers);
  }

  /**
   * Obtiene las preguntas del examen de la base de datos.
   */
  getExamQuestions(): void {
    this.questionService.getGenerateExamen().subscribe(
      (questions: any[]) => {
        this.questions = questions;
        this.questionNumbers = this.generateQuestionNumbers(this.questions.length);
      },
      (error) => {
        console.error('Error al obtener preguntas para el examen:', error);
      }
    );
  }

  /**
   * Genera los números de las preguntas.
   * @param numQuestions El número total de preguntas.
   * @returns Un array de cadenas que representan los números de las preguntas.
   */
  generateQuestionNumbers(numQuestions: number): string[] {
    return Array.from({ length: numQuestions }, (_, index) => {
      const number = index + 1;
      return number < 10 ? `0${number}` : `${number}`;
    });
  }

  /**
   * Selecciona una pregunta.
   * @param index El índice de la pregunta seleccionada.
   */
  selectQuestion(index: number): void {
    this.selectedQuestionIndex = index;
    console.log(index)
    if (this.selectedAnswers[index] === null) {
      // Si no hay una selección previa, inicializarla con una cadena vacía
      this.selectedAnswers[index] = '';
    }
    console.log(this.selectedAnswers);
    this.respuestasSeleccionadas = this.examenRealService.calcularRespuestasSeleccionadas(this.selectedAnswers);
  }

  /**
   * Borra una respuesta.
   */
  borrarRespuesta(): void {
    // Establece la respuesta seleccionada de la pregunta actual como null
    this.selectedAnswers[this.selectedQuestionIndex] = null;
    this.calcularRespuestasSeleccionadas();
  }

  /**
   * Obtiene el número de preguntas contestadas.
   * @returns El número de preguntas contestadas.
   */
  get preguntasContestadas(): number {
    return this.selectedAnswers.filter(answer => answer !== null).length;
  }

  /**
   * Obtiene el número de preguntas que aún no han sido contestadas.
   * @returns El número de preguntas sin contestar.
   */
  get preguntasSinContestar(): number {
    return this.questionNumbers.reduce((count, _, index) => {
      if (!this.selectedAnswers[index]) {
        // Si no hay respuesta seleccionada para esta pregunta
        count++;
      }
      return count;
    }, 0);
  }

  /**
   * Ordena las respuestas seleccionadas.
   */
  ordenarRespuestasSeleccionadas(): void {
    // Filtrar las respuestas vacías y ordenar las respuestas seleccionadas únicas por índice
    const uniqueResponses = Array.from(new Set(this.respuestasSeleccionadas.filter(respuesta => respuesta !== '')));
    this.respuestasSeleccionadas = uniqueResponses.sort((a, b) => {
      const indexA = parseInt(a.substring(0, a.length - 1));
      const indexB = parseInt(b.substring(0, b.length - 1));
      return indexA - indexB;
    });
  }

  /**
   * Determina si se debe agregar una coma antes de la respuesta en la lista.
   * @param index El índice de la respuesta.
   * @returns Verdadero si se debe agregar una coma, falso en caso contrario.
   */
  shouldAddComma(index: number): boolean {
    // Verificar si la respuesta actual es consecutiva a la anterior
    if (index > 0) {
      const prevResponseIndex = parseInt(this.respuestasSeleccionadas[index - 1]);
      if (prevResponseIndex === index - 1) {
        return true; // Agregar coma si la respuesta actual es consecutiva a la anterior
      }
    }
    return false;
  }
}
