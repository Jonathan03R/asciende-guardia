import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const routerInjection = () => inject(Router);
export const authStateObs$ = () => inject(AuthService).authState$;


// cuando el usario no este logeado no pondra entrar al dashboard
export const authGuard: CanActivateFn = () => {
  const router = routerInjection();

  return authStateObs$().pipe(
    map((user) => {
      if (!user ){
        router.navigateByUrl('/auth')
        return false
      }if (!user.emailVerified) {      
        router.navigateByUrl('/auth');
        
        return false;
      }
      return true
    })
  );
};

// cuando el usario esta logeado no podra ir a la autoeticacion 

export const publicGuard: CanActivateFn = () => {
  const router = routerInjection();

  return authStateObs$().pipe(
    map((user) => {
      if (user && user.emailVerified){
        router.navigateByUrl('/dash')
        return false
      }

      
      return true
    })
  );
};
