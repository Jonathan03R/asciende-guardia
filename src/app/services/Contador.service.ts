import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContadorService {
  private timeLeft: number = 0;
  private interval$ = new Subject<void>();

  constructor() { }

  startTimer(durationInSeconds: number): Observable<string> {
    this.timeLeft = durationInSeconds;
    return timer(0, 1000).pipe(
      takeUntil(this.interval$ ),
      map(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--; // Reducir el tiempo restante en cada iteración del temporizador
        }
        return this.convertSecondsToTime(this.timeLeft);
      })
    );
  }

  stopTimer() {
    this.interval$.next();
  }

  private convertSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.formatTimeUnit(hours)}:${this.formatTimeUnit(minutes)}:${this.formatTimeUnit(remainingSeconds)}`;
  }

  private formatTimeUnit(unit: number): string {
    return unit < 10 ? `0${unit}` : `${unit}`;
  }

}

