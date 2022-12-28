import { Component, OnInit } from '@angular/core';
import { SnackService } from 'src/app/service/snack.service';

@Component({
  selector: 'app-create-candymachine',
  templateUrl: './create-candymachine.component.html',
  styleUrls: ['./create-candymachine.component.css']
})
export class CreateCandymachineComponent implements OnInit {

  constructor(private snackService: SnackService) { }

  ngOnInit(): void { }

  createCandymachine() {
    this.snackService.showWarning('Creating candymachine');
  }
}
