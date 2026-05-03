import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  debug(message: string, ...optionalParams: unknown[]): void {
    if (!environment.production) {
      console.debug(message, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: unknown[]): void {
    if (!environment.production) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: unknown[]): void {
    if (!environment.production) {
      console.error(message, ...optionalParams);
    }
  }
}
