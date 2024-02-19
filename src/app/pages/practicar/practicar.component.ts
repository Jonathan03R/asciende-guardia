import { CommonModule } from '@angular/common';
import {  Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TemasService } from '../../services/serviciosBackend/temas.service';
import { AlertasService } from '../../services/alertas.service';
import { RouterOutlet } from '@angular/router';
import {  SlickCarouselModule } from 'ngx-slick-carousel';

declare var bootbox:any;

@Component({
  selector: 'app-practicar',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    SlickCarouselModule,
    RouterOutlet
  ],
  templateUrl: './practicar.component.html',
  styleUrl: './practicar.component.css'
})
export default class PracticarComponent {

  private alert = inject(AlertasService)
  private temasService = inject(TemasService)

  items: any[] = [];


  slides = [
    { tema: "tema 1" },
    { tema: "tema 2" },
    { tema: "tema 3" },
    { tema: "tema 4" },
    { tema: "tema 5" },
  ];

  slideConfig = {
    "slidesToShow": 3, // Muestra 3 elementos a la vez
    "slidesToScroll": 1,
    "autoplay": true, 
    "autoplaySpeed": 2000, 
    "responsive": [
      {
        "breakpoint": 768, // Ancho de la pantalla donde se aplica el cambio
        "settings": {
          "slidesToShow": 1, // Muestra solo 1 elemento en pantallas pequeñas
          "slidesToScroll": 1 // Se desplaza de uno en uno
        }
      }
    ]
  };
  



  obtenerTemas() {
    this.temasService.getTemas().subscribe(
      temas => {
        // Mapear los temas obtenidos del backend al formato deseado
        this.items = temas.map(tema => ({ id: tema.tema_id, name: tema.tema_nombre }));
      },
      error => {
        console.error('Error al obtener temas:', error);
        // this.alertas.AlertaPersonalizada("error", "No hay temas", "No existen temas disponibles en este momento");

      }
    );
  }

  alertas(): void {
    this.alert.alertas();
  }

  

  

}
