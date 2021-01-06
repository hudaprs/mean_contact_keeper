import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Auth } from '../models';
import { REGISTER_URL, LOGIN_URL } from '../util';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface AuthArgumentInterface {
  name?: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  authSubject = new BehaviorSubject<Auth>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {}

  register(authData: AuthArgumentInterface): Observable<any> {
    return this.http.post(REGISTER_URL, authData).pipe(
      catchError(this.handleAuthenticationError),
      map((auth) => this.handleAuthentication(auth, false))
    );
  }

  login(authData: AuthArgumentInterface): Observable<any> {
    return this.http.post(LOGIN_URL, authData).pipe(
      catchError(this.handleAuthenticationError),
      map((auth) => this.handleAuthentication(auth, true))
    );
  }

  autoLogin() {
    if (localStorage.getItem('authData')) {
      const {
        token,
        user: { name, email },
      } = JSON.parse(localStorage.getItem('authData'));
      const storedAuth = new Auth(name, email, token);
      this.authSubject.next(storedAuth);
    } else {
      this.logout();
    }
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('authData');
    this.router.navigate(['/login']);
  }

  private handleAuthentication(
    authData: any,
    isLogin: boolean
  ): string | boolean {
    const { results, message } = authData;
    if (isLogin) {
      const { name, email } = results.user;
      const { token } = results;
      const storedAuth = new Auth(name, email, token);
      localStorage.setItem('authData', JSON.stringify(results));
      this.authSubject.next(storedAuth);
      this.router.navigate(['/']);
      return message;
    } else {
      this.router.navigate(['/login']);
      return message;
    }
  }

  private handleAuthenticationError(err: HttpErrorResponse): any {
    return throwError(
      typeof err.error === 'string' ? err.error : err.error.message
    );
  }
}
