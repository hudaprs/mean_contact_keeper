import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Contact } from '../../models';
import { ContactService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  contactSubscription: Subscription;
  loading: boolean = false;
  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loading = true;
    this.contactService.getContacts().subscribe(
      () => (this.loading = false),
      () => (this.loading = false)
    );

    this.contactSubscription = this.contactService.contactSubject.subscribe(
      (contacts) => {
        this.contacts = contacts;
      }
    );
  }

  ngOnDestroy() {
    this.contactSubscription.unsubscribe();
  }
}
