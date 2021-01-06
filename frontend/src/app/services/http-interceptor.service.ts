import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { take, exhaustMap, catchError } from 'rxjs/operators';

import { AuthService } from './';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('INTERCEPTOR', req);
    return this.authService.authSubject.pipe(
      take(1),
      exhaustMap((auth) => {
        if (auth) {
          const modifiedReq = req.clone({
            headers: new HttpHeaders({
              'x-auth-token': auth.token,
            }),
          });
          return next.handle(modifiedReq);
        } else {
          return next.handle(req);
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }

  handleError(errorRes: HttpErrorResponse) {
    if (errorRes.status === 401) {
      this.authService.logout();
      console.error('ERROR FROM INTERCEPTOR: UNAUTHORIZED', errorRes);
      return throwError('Unauthorized');
    }
    console.error('ERROR FROM INTERCEPTOR', errorRes);
    return throwError(errorRes);
  }
}
