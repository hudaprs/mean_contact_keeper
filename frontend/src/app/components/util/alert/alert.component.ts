import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() successMessage: string = '';
  @Input() errorMessage: string = '';

  setVisibility() {
    return this.successMessage || this.errorMessage;
  }

  setClasses() {
    let classes = {
      alert: true,
      'alert-error': true,
    };

    return classes;
  }
}
