import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const errorResponse = (err: HttpErrorResponse): any => {
  console.error(err);
  return throwError(
    typeof err.error === 'string'
      ? err.error
      : typeof err.error === 'object' && err.error.hasOwnProperty('message')
      ? err.error.message
      : 'Something went wrong'
  );
};
