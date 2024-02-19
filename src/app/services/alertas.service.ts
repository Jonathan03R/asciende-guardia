import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as bootbox from 'bootbox';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  private modalOpenSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  mostrarModal(): void {
    bootbox.alert('Este es un mensaje de alerta de Bootbox');
  }
}
