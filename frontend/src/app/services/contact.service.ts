import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { Contact } from '../models';
import { CONTACT_URL } from '../util';

interface ContactDataInterface {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  loading?: boolean;
  results?: [];
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  contactSubject = new Subject<Contact[]>();
  currentSubject = new Subject<Contact>();
  private contacts: Contact[] = [];

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any> {
    return this.http.get<Contact[]>(CONTACT_URL).pipe(
      map((contacts: any) => {
        this.contacts = contacts.results;
        this.contactSubject.next(this.contacts);
      }),
      catchError((err) => this.handleContactError(err))
    );
  }

  createContact(contactData: ContactDataInterface): Observable<any> {
    return this.http.post(CONTACT_URL, contactData).pipe(
      map((contact: any) => {
        this.contacts = [contact.results, ...this.contacts];
        this.contactSubject.next(this.contacts);
        return contact;
      }),
      catchError((err) => this.handleContactError(err))
    );
  }

  deleteContact(contactId: string): Observable<any> {
    return this.http.delete(`${CONTACT_URL}/${contactId}`).pipe(
      map((contact: any) => {
        this.contacts = this.contacts.filter(
          (previousContact: any) => previousContact._id !== contactId
        );
        this.contactSubject.next(this.contacts);
        return {
          ...contact,
          results: this.contacts,
        };
      }),
      catchError((err) => this.handleContactError(err))
    );
  }

  handleContactError(err: HttpErrorResponse): any {
    return throwError(
      typeof err.error === 'string' ? err.error : err.error.message
    );
  }
}
