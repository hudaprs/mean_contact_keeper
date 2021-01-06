import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  authSubjectSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.authSubjectSubscription = this.authService.authSubject.subscribe(
      (auth) => {
        if (auth) {
          this.router.navigate(['/']);
        }
      }
    );
  }

  onSubmit() {
    // Simple validation
    if (!this.email || !this.password) {
      return this.toast.error('Please fill all forms', 'ERROR');
    }

    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.handleLoginMisc('ON_SUBMIT');
    this.authService.login(loginData).subscribe(
      (authSuccess) => this.handleLoginMisc('ON_SUCCESS', authSuccess),
      (authError) => this.handleLoginMisc('ON_ERROR', authError)
    );
  }

  handleLoginMisc(type: string, payload?: any): void {
    switch (type) {
      case 'ON_SUBMIT':
        this.loading = true;
        break;
      case 'ON_SUCCESS':
        this.loading = false;
        this.email = '';
        this.password = '';
        this.toast.success(payload, 'SUCCESS');
        break;
      case 'ON_ERROR':
        this.loading = false;
        this.toast.error(payload, 'ERROR');
        break;
      default:
        this.loading = false;
    }
  }

  ngOnDestroy() {
    this.authSubjectSubscription.unsubscribe();
  }
}
