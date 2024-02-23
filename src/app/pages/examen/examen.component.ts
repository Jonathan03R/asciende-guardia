import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { QuestionService } from '../../services/serviciosBackend/question.service';
import { interval } from 'rxjs';
import { ChangeBgDirective } from '../../change-bg.directive';
import { UserInfoServiceService } from '../../services/UserInfoService.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-examen',
  standalone: true,
  imports: [
    CommonModule,
    ChangeBgDirective,
    NgClass,
    FormsModule
  ],
  templateUrl: './examen.component.html',
  styleUrl: './examen.component.css',
})
export default class ExamenComponent implements OnInit {
  private userInfoService = inject(UserInfoServiceService);
  private questionService = inject(QuestionService);
  public name: string = "";
  preguntas: any[] = [];
  preguntaActual: any;
  currentQuestionIndex: number = 0;
  selectedQuestionIndex: number = 0;
  preguntaActualIndex: number = 1;

  preguntasSeleccionadas: boolean[] = [];
  public points: number = 0;
  counter = 10;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted: boolean = false;


  ngOnInit(): void {
    this.startCounter();
    this.inicializarUsuario();
    this.obtenerPreguntasAleatorias();
  }

  // obtener el nombre del usuario actual
  inicializarUsuario() {
    // Obtener la información del usuario del servicio
    const userInfo = this.userInfoService.getUserInfo();
    // Si la información existe y tiene el campo de nombre
    if (userInfo && userInfo.usuario_nombre) {
      this.name = userInfo.usuario_nombre;
    }
  }

  obtenerPreguntasAleatorias(): void {
    this.questionService.getRandomQuestions().subscribe(
      (data) => {
        this.preguntas = data;
        this.preguntaActual = this.preguntas[this.currentQuestionIndex];
        this.preguntasSeleccionadas = Array(this.preguntas.length).fill(false);
      },
      (error) => {
        console.error('Error al obtener preguntas aleatorias:', error);
      }
    );
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.preguntas.length - 1) {
      this.currentQuestionIndex++;
      this.preguntaActualIndex++;
      this.preguntaActual = this.preguntas[this.currentQuestionIndex];
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.preguntaActualIndex--;
      this.preguntaActual = this.preguntas[this.currentQuestionIndex];
    }
  }

  goToQuestion(): void {
    if (this.selectedQuestionIndex >= 0 && this.selectedQuestionIndex < this.preguntas.length) {
      this.preguntaActualIndex = Number(this.selectedQuestionIndex) + 1;
      this.preguntaActual = this.preguntas[this.selectedQuestionIndex];
    }
  }

  // desabilitar botones

  shouldDisableNextButton(): boolean {
    return this.preguntaActualIndex === this.preguntas.length;
  }

  // determinar cuando se respodio correctamente

  checkAnswer(selectedAnswer: string): boolean {
    // Obtener la respuesta correcta de la pregunta actual
    const correctAnswer = this.preguntaActual.respuesta_correcta;

    // Verificar si la respuesta seleccionada es igual a la respuesta correcta
    return selectedAnswer === correctAnswer;
  }



  answer(currentQno: number, selectedAnswer: string) {
    
    if (this.preguntasSeleccionadas[this.currentQuestionIndex]) {
      this.currentQuestionIndex++;
      this.preguntaActualIndex++;
      this.preguntaActual = this.preguntas[this.currentQuestionIndex];
      return;
    }

    const isCorrect = this.checkAnswer(selectedAnswer);
    if (currentQno === this.preguntas.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    if (isCorrect) {
      this.points += 10;
      this.correctAnswer++;
    } else {
      this.points -= 10;
      this.inCorrectAnswer++;
    }
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.preguntaActualIndex++;
      this.preguntaActual = this.preguntas[this.currentQuestionIndex];
      this.resetCounter();
      this.getProgressPercent();
    }, 500);
    this.preguntasSeleccionadas[this.currentQuestionIndex] = true; // Marcar la pregunta como respondida
  }


  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter === 0) {
          this.currentQuestionIndex++;
          this.preguntaActualIndex++;
          this.preguntaActual = this.preguntas[this.currentQuestionIndex];
          this.counter = 10;
          this.points -= 10;
        }
      });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }

  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 10;
    this.startCounter();
  }

  resetQuiz() {
    this.resetCounter();
    this.points = 0;
    this.counter = 60;
    this.currentQuestionIndex = 0;
    this.progress = "0";

  }
  getProgressPercent() {
    this.progress = ((this.currentQuestionIndex / this.preguntas.length) * 100).toString();
    return this.progress;

  }
}
