import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
  name: string = '';
  email: string = '';
  password: string = '';
  password2: string = '';
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
    if (!this.name || !this.email || !this.password || !this.password2) {
      return this.toast.error('Please fill all forms', 'ERROR');
    } else if (this.password !== this.password2) {
      return this.toast.error('Password confirmation did not match', 'ERROR');
    }

    const registerData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.handleRegisterMisc('ON_SUBMIT');
    this.authService.register(registerData).subscribe(
      (authSuccess) => this.handleRegisterMisc('ON_SUCCESS', authSuccess),
      (authError) => this.handleRegisterMisc('ON_ERROR', authError)
    );
  }

  handleRegisterMisc(type: string, payload?: any): void {
    switch (type) {
      case 'ON_SUBMIT':
        this.loading = true;
        break;
      case 'ON_SUCCESS':
        this.loading = false;
        this.name = '';
        this.email = '';
        this.password = '';
        this.password2 = '';
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
