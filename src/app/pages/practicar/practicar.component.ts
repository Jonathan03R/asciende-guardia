import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practicar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './practicar.component.html',
  styleUrl: './practicar.component.css'
})
export default class PracticarComponent {
  mostrarSelect: boolean = false;
  mostrarOptions: boolean = false;


  logMostrarSelect() {
    console.log('mostrarSelect:', this.mostrarSelect);
  }

  toggleSelect() {
    const radio2 = document.getElementById('radio2') as HTMLInputElement;
    const radio1 = document.getElementById('radio1') as HTMLInputElement;
    if (radio2.checked) {
      this.mostrarSelect = true;
      this.mostrarOptions = false;
      console.log('El radio button está activo');
    } else if (radio1.checked) {
      this.mostrarSelect = false;
      this.mostrarOptions = true
      console.log('El radio button ya no está activo');
    }
  }

  options = [
    {
      id:1, name: 'Todas las preguntas'
    },
    {
      id:2, name: 'Preguntas equivocadas'
    }
  ]

  items = [
    { id: 1, name: 'Tema 1' },
    { id: 2, name: 'Tema 2' },
    { id: 3, name: 'Tema 3' },
    { id: 4, name: 'Tema 4' },
    { id: 5, name: 'Tema 5' },
    { id: 6, name: 'Tema 6' },
    { id: 7, name: 'Tema 7' },
    { id: 8, name: 'Tema 8' },
    { id: 9, name: 'Tema 9' },
    { id: 10, name: 'Tema 10' },
    { id: 11, name: 'Tema 11' },
    { id: 12, name: 'Tema 12' },
    { id: 13, name: 'Tema 13' },
    { id: 14, name: 'Tema 14' },
    { id: 15, name: 'Tema 15' },
    { id: 16, name: 'Tema 16' },
    { id: 17, name: 'Tema 17' }
  ];


}
