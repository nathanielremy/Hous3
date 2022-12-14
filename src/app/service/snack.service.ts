import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../common/snack-bar/snack-bar.component';

export enum SNACK_TYPE {
  DEFAULT,
  INFO,
  SUCCESS,
  WARN,
  ERROR,
}

@Injectable({
  providedIn: 'root',
})
export class SnackService {
  constructor(private _snackBar: MatSnackBar) {}

  showSnackBar(message: String, type: SNACK_TYPE = SNACK_TYPE.DEFAULT) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
      data: {
        message,
        type,
      },
    });
  }

  showSuccess(message: String) {
    this.showSnackBar(message, SNACK_TYPE.SUCCESS);
  }

  showWarning(message: String) {
    this.showSnackBar(message, SNACK_TYPE.WARN);
  }

  showError(message: String) {
    this.showSnackBar(message, SNACK_TYPE.ERROR);
  }
}
