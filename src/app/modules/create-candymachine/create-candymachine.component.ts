import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { StepperOrientation } from '@angular/material/stepper';

@Component({
  selector: 'app-create-candymachine',
  templateUrl: './create-candymachine.component.html',
  styleUrls: ['./create-candymachine.component.css']
})
export class CreateCandymachineComponent implements OnInit {

  stepperOrientation: StepperOrientation = "horizontal";

  constructor(private breakPointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakPointObserver
    .observe(['(max-width: 768px)'])
    .subscribe((state) => {
      this.stepperOrientation = state.matches
        ? "vertical"
        : "horizontal";
    });
  }
}
