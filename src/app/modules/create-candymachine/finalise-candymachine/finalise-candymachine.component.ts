import { Component, Input, OnInit } from '@angular/core';
import { CandyMachine } from '@metaplex-foundation/js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { truncateAddress } from 'src/app/common/utils/utils';

@Component({
  selector: 'app-finalise-candymachine',
  templateUrl: './finalise-candymachine.component.html',
  styleUrls: ['./finalise-candymachine.component.css']
})
export class FinaliseCandymachineComponent implements OnInit {
  @Input() candyMachine: CandyMachine | null = null;

  imageUrl: string =
    'https://pe3ulbgyicmxrp54kqzucge7m53hf4srdvjzo5227zlt2w35x4na.arweave.net/eTdFhNhAmXi_vFQzQRifZ3Zy8lEdU5d3Wv5XPVt9vxo?ext=png';

  constructor() { }

  get truncatedCandyMachineAddress(): string {
    return truncateAddress(this.candyMachine?.address?.toString());
  }

  get candyMachineSupply() {
    return this.candyMachine?.itemsAvailable ?? 'N/A';
  }

  get candyMachinePrice() {
    return this.candyMachine?.candyGuard?.guards?.solPayment?.amount?.basisPoints
      ? this.candyMachine.candyGuard.guards.solPayment.amount.basisPoints / LAMPORTS_PER_SOL
      : 'N/A';
  }

  get candyMachineRoyalty() {
    return this.candyMachine?.sellerFeeBasisPoints
      ? this.candyMachine.sellerFeeBasisPoints / 100
      : 'N/A';
  }

  get candyMachineSymbol() {
    return this.candyMachine?.symbol ?? 'N/A';
  }

  get candyMachineStartDate() {
    return this.candyMachine?.candyGuard?.guards?.startDate?.date
      ? this.candyMachine.candyGuard.guards.startDate.date
      : 'N/A';
  }

  get candyMachineEndDate() {
    return this.candyMachine?.candyGuard?.guards?.endDate?.date
      ? this.candyMachine.candyGuard.guards.endDate.date
      : 'N/A';
  }

  ngOnInit(): void {
  }

}
