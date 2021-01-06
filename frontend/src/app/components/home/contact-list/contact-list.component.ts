import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from 'src/app/models';
import { ContactService } from '../../../services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
})
export class ContactListComponent {
  @Input() contacts: Contact[];
  currentSubject = new Subject<Contact>();
  loading: boolean = false;

  constructor(
    private contactService: ContactService,
    private toast: ToastrService
  ) {}

  setCurrent(contact) {
    this.currentSubject.next(contact);
  }

  onDelete(contactId: string) {
    this.loading = true;
    this.contactService.deleteContact(contactId).subscribe(
      (contacts) => {
        this.loading = false;
        this.contacts = contacts.results;
        this.toast.success(contacts.message, 'SUCCESS');
      },
      (err) => {
        this.toast.error(err, 'ERROR');
        this.loading = false;
      }
    );
  }
}
