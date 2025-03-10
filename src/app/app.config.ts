import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';


// export const BASE_URL = 'http://localhost:8080';
export const BASE_URL = 'http://192.168.10.18:8080';



export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"asciendeguardiafirebase","appId":"1:492588283923:web:41e131b833f1bbaae327e6","storageBucket":"asciendeguardiafirebase.appspot.com","apiKey":"AIzaSyCNJO3Wy8k5i5KX7Kft3ookiP0ognodXpA","authDomain":"asciendeguardiafirebase.firebaseapp.com","messagingSenderId":"492588283923"}))), importProvidersFrom(provideAuth(() => getAuth()))]
};
