import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'asciende-guardia-standalone';

  private authService = inject(AuthService);

  constructor() {
    this.authService.setupInactivityTracking();



jajjsjjdjdj
lekfjoehye bnajofbsbd shdiekdkdjfjjdjehrufjfhudhff

fjfifjw
firlwj
fiebfined
furifmfijdmf
gkshgjwibsufuwfuqljufjw



jdjejdkd
  }
}
