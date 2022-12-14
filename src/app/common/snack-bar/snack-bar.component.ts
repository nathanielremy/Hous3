import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SNACK_TYPE } from 'src/app/service/snack.service';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css'],
})
export class SnackBarComponent implements OnInit {
  message: String;
  type: SNACK_TYPE;

  DEFAULT = SNACK_TYPE.DEFAULT;
  INFO = SNACK_TYPE.INFO;
  SUCCESS = SNACK_TYPE.SUCCESS;
  WARN = SNACK_TYPE.WARN;
  ERROR = SNACK_TYPE.ERROR;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data.message ? data.message : 'Unknown error occured.';
    this.type = data.type;
  }

  ngOnInit(): void {}
}
