import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { routes } from '../../app.routes';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import SpinnerComponent from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SpinnerComponent
    
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export default class NavComponent implements OnInit{
  dataUser: any;
  spinner: boolean = true;
  public menuItems= routes
    .map(routes => routes.children ?? [])
    .flat()
    .filter(routes => routes && routes.path)
    .filter(routes => !routes.path?.includes('**'))
    .filter(routes => !routes.path?.includes('hea'));
 

  private _router = inject(Router);

  redirectToPantallaCarga() {
    this._router.navigate(['/cargando']);
  }
  private authService = inject(AuthService);
  ngOnInit(): void {
    
  }
  async logOut(): Promise<void>{
    try {
      await this.authService.logOut()
      this._router.navigateByUrl('/auth')
    } catch (error) {
      console.log(error);
    }
  }

    



}
