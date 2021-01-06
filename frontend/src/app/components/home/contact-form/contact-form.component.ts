import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { Auth, Contact } from '../../../models';
import { ContactService } from '../../../services';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  type: string = 'personal';
  current: Contact;
  loading: boolean = false;
  isEdit: boolean = false;

  authenticatedUser: Auth;
  authenticatedUserSubscription: Subscription;

  constructor(
    private contactService: ContactService,
    private toast: ToastrService
  ) {}

  onSubmit() {
    // Simple validation
    if (!this.name || !this.email || !this.phone) {
      return this.toast.error('Please fill all forms', 'ERROR');
    }

    let contact = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      type: this.type,
    };

    this.handleContactFormMisc('ON_SUBMIT');

    let contactObs;

    if (!this.isEdit) {
      contactObs = this.contactService.createContact(contact);
    }
    contactObs.subscribe(
      (contact) => this.handleContactFormMisc('ON_SUCCESS', contact),
      (err) => this.handleContactFormMisc('ON_ERROR', err)
    );
  }

  handleContactFormMisc(type: string, payload?: any): void {
    switch (type) {
      case 'ON_SUBMIT':
        this.loading = true;
        break;
      case 'ON_SUCCESS':
        this.loading = false;
        this.name = '';
        this.email = '';
        this.phone = '';
        this.type = 'personal';
        this.toast.success(payload.message, 'SUCCESS');
        break;
      case 'ON_ERROR':
        this.loading = false;
        this.toast.error(payload, 'ERROR');
        break;
      default:
        this.loading = false;
    }
  }
}
