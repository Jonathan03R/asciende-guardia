import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../app.config'; 
@Injectable({
  providedIn: 'root'
})
export class BackendUserService {
  // private baseUrl = 'http://localhost:8080';
  constructor(private http:HttpClient) { }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/user/register`, userData);
  }

  getUserInfo(usuario_correo: string): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/user/userinfo`, { usuario_correo });
  }

}
