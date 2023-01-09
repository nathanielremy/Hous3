import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { StepperOrientation } from '@angular/material/stepper';
import { CandyMachine } from '@metaplex-foundation/js';
import { truncateAddress } from 'src/app/common/utils/utils';

@Component({
  selector: 'app-create-candymachine',
  templateUrl: './create-candymachine.component.html',
  styleUrls: ['./create-candymachine.component.css']
})
export class CreateCandymachineComponent implements OnInit {
  candyMachine: CandyMachine | null = null;

  stepperOrientation: StepperOrientation = "horizontal";

  constructor(private breakPointObserver: BreakpointObserver) { }

  get truncatedCandyMachineAddress(): string {
    return truncateAddress(this.candyMachine?.address?.toString());
  }

  ngOnInit(): void {
    this.breakPointObserver
    .observe(['(max-width: 768px)'])
    .subscribe((state) => {
      this.stepperOrientation = state.matches
        ? "vertical"
        : "horizontal";
    });
  }

  setCandyMachine(candyMachine: CandyMachine) {
    this.candyMachine = candyMachine;
  }
}
