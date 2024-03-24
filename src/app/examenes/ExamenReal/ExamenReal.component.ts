import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { QuestionService } from '../../services/serviciosBackend/question.service';
import { FormsModule } from '@angular/forms';
import { UserInfoServiceService } from '../../services/UserInfoService.service';
import { ContadorService } from '../../services/Contador.service';
import { Observable, Subscription } from 'rxjs';

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

  questionNumbers: any[] = [];
  questions: any[] = [];
  selectedQuestionIndex: number = 0;
  selectedAnswers: (string | null)[] = [];
  respuestasSeleccionadas: string[] = [];
  public name: string = "";

  displayTime$: Observable<string> | undefined;
  private timerSubscription: Subscription | undefined;

  private questionService = inject(QuestionService);
  private userInfoService = inject(UserInfoServiceService);
  private contadorService = inject(ContadorService);

  ngOnInit(): void {
    this.getExamQuestions();
    this.inicializarSelectedAnswers();
    this.ordenarRespuestasSeleccionadas();
    this.inicializarUsuario();
    this.startTimer();
  }
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  startTimer(): void {
    const durationInSeconds = 7200; // 2 horas
    this.displayTime$ = this.contadorService.startTimer(durationInSeconds);
    this.timerSubscription = this.displayTime$.subscribe(time => {
      if (time === '00:00:00') {
        this.showAlert();
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      }
    });
  }

  showAlert(): void {
    alert('¡El tiempo ha expirado!');
  }
  
  inicializarUsuario() {
    // Obtener la información del usuario del servicio
    const userInfo = this.userInfoService.getUserInfo();
    // Si la información existe y tiene el campo de nombre
    if (userInfo && userInfo.usuario_nombre) {
      this.name = userInfo.usuario_nombre;
    }
  }

  private inicializarSelectedAnswers(): void {
    this.selectedAnswers = Array.from({ length: this.questionNumbers.length }, () => '');
  }
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


  borrarRespuesta(): void {
    // Establece la respuesta seleccionada de la pregunta actual como null
    this.selectedAnswers[this.selectedQuestionIndex] = null;
    this.calcularRespuestasSeleccionadas();

  }


  //DETERMINAR PREGUNTAS MARCADAS Y ALS QUE ESTAN DESMARCARDAS
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
