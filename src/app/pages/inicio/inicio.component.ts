import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import ExamenRealComponent from '../../examenes/ExamenReal/ExamenReal.component';
import { QuestionService } from '../../services/serviciosBackend/question.service';
import { UserInfoServiceService } from '../../services/UserInfoService.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    ExamenRealComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export default class InicioComponent implements OnInit {
  private _router = inject(Router);
  private questionService = inject(QuestionService);
  private userInfoService = inject(UserInfoServiceService);

  public userId: number = 0;  

  examenReal: boolean = true;
  redirectToPractica() {


    if(this.examenReal){
      this.examenReal= false;
    }
  }

  ngOnInit(): void {
    this.initializeUserName();
    
  }


  initializeUserName() {
    // Obtener la información del usuario del servicio
    const userInfo = this.userInfoService.getUserInfo();
    // Si la información existe y tiene el campo de nombre
      this.userId = userInfo.usuario_id;
      console.log(this.userId)
  }

  verifyExamEligibility(): void {
    this.questionService.checkExamEligibility(this.userId).subscribe(
      (response) => {
        if (response && response.status === 200) {
          // Verificar el mensaje de la respuesta
          if (response.message === "El usuario puede realizar un examen en cualquier momento") {

            console.log('Acceso: El usuario puede realizar un examen en cualquier momento');
          } else if (response.message === "Ya has realizado un examen hoy") {

            console.log('Sin acceso: Ya has realizado un examen hoy');
           
          } else {
            console.log('Estado 200, pero mensaje no reconocido:', response.message);
          }
        } else {
          console.log('Error en la respuesta del servidor:', response);
          
        }
      },
      (error) => {
        console.error('Error al verificar la elegibilidad del examen:', error);
        // Manejar cualquier error que ocurra durante la verificación
      }
    );
  }


  items = [
    { id: 1, name: 'Evaluar su nivel de preparación.' },
    { id: 2, name: 'Mejorar su rendimiento durante la prueba.' },
    { id: 3, name: 'Reducir el estrés y la ansiedad antes del examen' },
    { id: 4, name: 'Familiarizarse con el formato y la estructura del examen.' },
    { id: 5, name: 'Identificar áreas de mejora y fortaleza en su conocimiento.' },
  ];
}
