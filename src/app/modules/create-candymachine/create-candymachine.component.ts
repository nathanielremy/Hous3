import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { StepperOrientation } from '@angular/material/stepper';
import { CandyMachine } from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import { truncateAddress } from 'src/app/common/utils/utils';
import { MetaplexService } from 'src/app/service/metaplex.service';

@Component({
  selector: 'app-create-candymachine',
  templateUrl: './create-candymachine.component.html',
  styleUrls: ['./create-candymachine.component.css']
})
export class CreateCandymachineComponent implements OnInit {
  candyMachine: CandyMachine | null = null;

  stepperOrientation: StepperOrientation = "horizontal";

  constructor(
    private breakPointObserver: BreakpointObserver,
    private mxService: MetaplexService
  ) { }

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

    this.getCandyMachine();
  }

  // MARK: For building only. Remove method & mxService later
  async getCandyMachine() {
    try {
      this.candyMachine = await this.mxService.getCandyMachine(
        new PublicKey('6X1s718vaXmxczecX4m5ter49ZwTm4TiFNv2D9u82Ach')
      );
    }
    catch (err) {
      console.log(`Error fetching cm ${err}`);
    }
  }

  setCandyMachine(candyMachine: CandyMachine) {
    this.candyMachine = candyMachine;
  }
}
