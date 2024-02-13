import { Injectable } from '@angular/core';
import { BASE_URL } from '../../app.config'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TemasService {

  constructor(private http: HttpClient) { 

  }

  getTemas(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/temas/temas`); 
  }

}
