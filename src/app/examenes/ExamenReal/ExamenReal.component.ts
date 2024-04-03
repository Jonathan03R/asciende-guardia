import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { QuestionService } from '../../services/serviciosBackend/question.service';
import { FormsModule } from '@angular/forms';
import { UserInfoServiceService } from '../../services/UserInfoService.service';
import { ContadorService } from '../../services/Contador.service';
import { Observable, Subject, Subscription, map, takeUntil, timer } from 'rxjs';

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
  private contadorService = inject(ContadorService);

  ngOnInit(): void {
    this.getExamQuestions();
    this.inicializarSelectedAnswers();
    this.ordenarRespuestasSeleccionadas();
    this.inicializarUsuario();
  }
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // Método para iniciar el examen y el temporizador
  mostrarExamen() {
    this.politicaSprivacidad = true;
    this.startTimer();
  }

  // Métodos para el temporizador
  private timeLeft: number = 7200; // Duración en segundos (2 horas)
  private destroy$ = new Subject<void>();
  startTimer(): void {
    this.displayTime$ = timer(0, 1000).pipe(
      takeUntil(this.destroy$),
      map(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--; // Reducir el tiempo restante en cada iteración del temporizador
        } else {
          this.stopTimer();
          alert('tiempo terminado') // Detener el temporizador cuando el tiempo llega a cero
        }
        return this.convertSecondsToTime(this.timeLeft);
      })
    );
  }


  stopTimer(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private convertSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.formatTimeUnit(hours)}:${this.formatTimeUnit(minutes)}:${this.formatTimeUnit(remainingSeconds)}`;
  }

  private formatTimeUnit(unit: number): string {
    return unit < 10 ? `0${unit}` : `${unit}`;
  }

  // Método para mostrar una alerta cuando el tiempo termina
  showAlert(): void {
    alert('¡El tiempo ha expirado!');
  }

  // Método para inicializar el nombre de usuario
  inicializarUsuario() {
    // Obtener la información del usuario del servicio
    const userInfo = this.userInfoService.getUserInfo();
    // Si la información existe y tiene el campo de nombre
    if (userInfo && userInfo.usuario_nombre) {
      this.name = userInfo.usuario_nombre;
    }
  }

  // Método para inicializar las respuestas seleccionadas
  private inicializarSelectedAnswers(): void {
    this.selectedAnswers = Array.from({ length: this.questionNumbers.length }, () => '');
  }

  // Método para calcular las respuestas seleccionadas
  calcularRespuestasSeleccionadas(): void {
    this.respuestasSeleccionadas = [];
    for (let i = 0; i < this.selectedAnswers.length; i++) {
      const answer = this.selectedAnswers[i];
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
        // Construir la cadena de respuesta
        const respuesta = (i + 1) + letra;

        // Verificar si es la primera respuesta de la lista
        if (this.respuestasSeleccionadas.length === 0) {
          // Si es la primera, simplemente la agregamos
          this.respuestasSeleccionadas.push(respuesta);
        } else {
          // Si no es la primera, agregamos una coma antes de agregar la respuesta
          this.respuestasSeleccionadas.push(', ' + respuesta);
        }
      }
    }
    
  }


  // Método para obtener las preguntas del examen de la bd
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

  generateQuestionNumbers(numQuestions: number): string[] {
    return Array.from({ length: numQuestions }, (_, index) => {
      const number = index + 1;
      return number < 10 ? `0${number}` : `${number}`;
    });
  }

  // Método para generar los números de las preguntas
  selectQuestion(index: number): void {
    this.selectedQuestionIndex = index;
    console.log(index)
    if (this.selectedAnswers[index] === null) {
      // Si no hay una selección previa, inicializarla con una cadena vacía
      this.selectedAnswers[index] = '';
    }
    console.log(this.selectedAnswers);
    this.calcularRespuestasSeleccionadas();
  }

  // Método para borrar una respuesta

  borrarRespuesta(): void {
    // Establece la respuesta seleccionada de la pregunta actual como null
    this.selectedAnswers[this.selectedQuestionIndex] = null;
    this.calcularRespuestasSeleccionadas();

  }


  /// Método para determinar las preguntas contestadas
  get preguntasContestadas(): number {
    return this.selectedAnswers.filter(answer => answer !== null).length;
  }

  // Contar las preguntas que aún no han sido contestadas (es decir, cuyas respuestas son null)
  get preguntasSinContestar(): number {
    return this.questionNumbers.reduce((count, _, index) => {
      if (!this.selectedAnswers[index]) {
        // Si no hay respuesta seleccionada para esta pregunta
        count++;
      }
      return count;
    }, 0);
  }

  ordenarRespuestasSeleccionadas(): void {
    // Filtrar las respuestas vacías y ordenar las respuestas seleccionadas únicas por índice
    const uniqueResponses = Array.from(new Set(this.respuestasSeleccionadas.filter(respuesta => respuesta !== '')));
    this.respuestasSeleccionadas = uniqueResponses.sort((a, b) => {
      const indexA = parseInt(a.substring(0, a.length - 1));
      const indexB = parseInt(b.substring(0, b.length - 1));
      return indexA - indexB;
    });
  }


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
