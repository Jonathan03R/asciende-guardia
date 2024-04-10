import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { QuestionService } from '../../services/serviciosBackend/question.service';
import { FormsModule } from '@angular/forms';
import { UserInfoServiceService } from '../../services/UserInfoService.service';
import { Observable, Subject, Subscription, map, takeUntil, timer } from 'rxjs';
import { ExamenRealService } from './Exam.service';
import { RespuestasService } from '../../services/serviciosBackend/respuestas.service';
import { SelectedQuestion } from './Exam';

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
  examenId: number = 0;
  questionIds: number[] = [];
  selectedQuestionIndex: number = 0;
  selectedAnswers: (string | null)[] = [];
  selectedAnswerTexts: string[] = [];
  selectedResponses: string[] = [];
  selectedQuestions: SelectedQuestion[] = [];
  public userName: string = ""; // Nombre del usuario
  public userId: number = 0;    // ID del usuario
  privacyPolicy: boolean = false;

  // Variable para mostrar el tiempo restante en el examen
  displayTime$: Observable<string> | undefined;
  private timerSubscription: Subscription | undefined;


  // Servicios inyectados
  private questionService = inject(QuestionService);
  private userInfoService = inject(UserInfoServiceService);
  private examenRealService = inject(ExamenRealService);
  private respuestasService = inject(RespuestasService);

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.loadExamQuestions();
    this.inicializarSelectedAnswers();
    this.orderSelectedResponses();
    this.initializeUserName();
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

    this.privacyPolicy = true;
    this.startTimer();
    console.log("examen mostrado")//depurar
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
  initializeUserName() {
    // Obtener la información del usuario del servicio
    const userInfo = this.userInfoService.getUserInfo();
    // Si la información existe y tiene el campo de nombre
    if (userInfo && userInfo.usuario_nombre) {
      this.userName = userInfo.usuario_nombre;
      this.userId = userInfo.usuario_id;
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
  calculateSelectedResponses(): void {
    this.selectedResponses = this.examenRealService.calculateSelectedResponses(this.selectedAnswers);
  }

  /**
   * Obtiene las preguntas del examen de la base de datos.
   */


  loadExamQuestions(): void {
    const userInfo = this.userInfoService.getUserInfo();
    this.questionService.getGenerateExamen(userInfo.usuario_id).subscribe(
      (examData: any) => {
        //recuperacion de datos
        this.examenId = examData.examenId;
        this.questions = examData.preguntas;
        this.questionNumbers = this.generateQuestionNumbers(this.questions.length);

        // Aquí puedes inicializar un array para almacenar los IDs de las preguntas
      this.questionIds = this.questions.map((question: any) => question.id);
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
   * Selecciona una pregunta del examen y actualiza las respuestas seleccionadas.
   * @param index El índice de la pregunta seleccionada.
   */
  selectQuestion(index: number): void {
    this.selectedQuestionIndex = index;
    let selectedAnswer = this.selectedAnswers[index];
    if (!selectedAnswer) {
      selectedAnswer = null;
    }
    const answerText = selectedAnswer !== null ? this.getAnswerText(selectedAnswer) : '';
    this.selectedAnswerTexts[index] = answerText;

    const preguntaId = this.questions[index]?.pregunta_id;;

    const selectedQuestion: SelectedQuestion = {
      preguntaId: preguntaId,
      alternativaSeleccionada: answerText,
    };

    // Agregar la pregunta seleccionada al array
    this.selectedQuestions[index] = selectedQuestion;

    // mensajes para depurar , es decir ver que me retorna y si es correcto
    // console.log('Índice de pregunta seleccionada:', index);
    // console.log('Respuestas seleccionadas:', this.selectedAnswers);
    // console.log('ID de la pregunta seleccionada:', preguntaId);
    // console.log('Preguntas seleccionadas:', this.selectedAnswerTexts);
    // console.log('FormatoPara EL backend :', this.selectedQuestions)
    this.selectedResponses = this.examenRealService.calculateSelectedResponses(this.selectedAnswers);
  }


  // Método para obtener el texto de la opción seleccionada
  getAnswerText(answerValue: string): string {
    const question = this.questions[this.selectedQuestionIndex];
    switch (answerValue) {
      case 'option1':
        return question.respuesta_texto1;
      case 'option2':
        return question.respuesta_texto2;
      case 'option3':
        return question.respuesta_texto3;
      case 'option4':
        return question.respuesta_texto4;
      default:
        return ''; // Manejar el caso de valor no válido, si es necesario
    }
  }

  /**
   * Borra una respuesta.
   */
  deleteResponse(): void {
    // Establece la respuesta seleccionada de la pregunta actual como null
    this.selectedAnswers[this.selectedQuestionIndex] = null;
    this.calculateSelectedResponses();
  }

  /**
   * Ordena las respuestas seleccionadas.
   */
  orderSelectedResponses(): void {
    // Filtrar las respuestas vacías y ordenar las respuestas seleccionadas únicas por índice
    const uniqueResponses = Array.from(new Set(this.selectedResponses.filter(respuesta => respuesta !== '')));
    this.selectedResponses = uniqueResponses.sort((a, b) => {
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
      const prevResponseIndex = parseInt(this.selectedResponses[index - 1]);
      if (prevResponseIndex === index - 1) {
        return true; // Agregar coma si la respuesta actual es consecutiva a la anterior
      }
    }
    return false;
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



  finalizarExamen(): void {
    // Obtener el ID de usuario y el ID de examen
    const userInfo = this.userInfoService.getUserInfo();
    const usuarioId = userInfo.usuario_id;
    const examenId = this.examenId;
  
    // Enviar las respuestas del usuario al backend
    this.selectedQuestions.forEach(selectedQuestion => {
      const preguntaId = selectedQuestion.preguntaId;
      const respuestaSeleccionada = selectedQuestion.alternativaSeleccionada !== null ? selectedQuestion.alternativaSeleccionada : '';
  
      // Llamar al servicio para enviar la respuesta del usuario al backend
      this.respuestasService.enviarRespuestaUsuario(usuarioId, examenId, preguntaId, respuestaSeleccionada).subscribe(
        (response: any) => {
          // Manejar la respuesta del servidor si es necesario
          console.log('Respuesta del servidor:', response);
        },
        (error: any) => {
          // Manejar el error si ocurre
          console.error('Error al enviar la respuesta al servidor:', error);
        }
      );
    });
  }


}
