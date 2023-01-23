import { Component, OnInit } from '@angular/core';
import { CandyMachine } from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import { truncateAddress } from 'src/app/common/utils/utils';
import { MetaplexService } from 'src/app/service/metaplex.service';

enum CREATION_STAGE {
  SETTINGS,
  ASSETS,
  FINALISE
}

@Component({
  selector: 'app-create-candymachine',
  templateUrl: './create-candymachine.component.html',
  styleUrls: ['./create-candymachine.component.css']
})
export class CreateCandymachineComponent implements OnInit {
  candyMachine: CandyMachine | null = null;

  selectedCreationStage: CREATION_STAGE = CREATION_STAGE.SETTINGS;

  SETTINGS_STAGE: CREATION_STAGE = CREATION_STAGE.SETTINGS;
  ASSETS_STAGE: CREATION_STAGE = CREATION_STAGE.ASSETS;
  FINALISE_STAGE: CREATION_STAGE = CREATION_STAGE.FINALISE;

  constructor(private mxService: MetaplexService) { }

  get truncatedCandyMachineAddress(): string {
    return truncateAddress(this.candyMachine?.address?.toString());
  }

  ngOnInit(): void {
    this.getCandyMachine();
  }

  // MARK: For building only. Remove method & mxService later
  async getCandyMachine() {
    try {
      this.candyMachine = await this.mxService.getCandyMachine(
        new PublicKey('5AWLTXAW5PuuAANJev8F4YmQP92g4SE9WkC5k1EaewQR')
      );
      console.log(this.candyMachine);
    }
    catch (err) {
      console.log(`Error fetching cm ${err}`);
    }
  }

  setCreationStage(stage: CREATION_STAGE) {
    this.selectedCreationStage = stage;
  }

  setCandyMachine(candyMachine: CandyMachine) {
    this.candyMachine = candyMachine;
  }
}
