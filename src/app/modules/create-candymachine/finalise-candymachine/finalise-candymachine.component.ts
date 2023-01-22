import { Component, Input, OnInit } from '@angular/core';
import { CandyMachine, formatDateTime } from '@metaplex-foundation/js';
import { Clipboard } from '@angular/cdk/clipboard';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { truncateAddress } from 'src/app/common/utils/utils';
import { SnackService } from 'src/app/service/snack.service';

@Component({
  selector: 'app-finalise-candymachine',
  templateUrl: './finalise-candymachine.component.html',
  styleUrls: ['./finalise-candymachine.component.css']
})
export class FinaliseCandymachineComponent implements OnInit {
  @Input() candyMachine: CandyMachine | null = null;

  constructor(
    private clipboard: Clipboard,
    private snackService: SnackService
  ) { }

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
      ? formatDateTime(this.candyMachine.candyGuard.guards.startDate.date)
      : 'N/A';
  }

  get candyMachineEndDate() {
    return this.candyMachine?.candyGuard?.guards?.endDate?.date
      ? formatDateTime(this.candyMachine.candyGuard.guards.endDate.date)
      : 'N/A';
  }

  get candyMachineHasCreators(): boolean {
    return (this.candyMachine?.creators?.length ?? 0) > 0;
  }

  ngOnInit(): void {
  }

  truncatePublicKey(publicKey: PublicKey): string {
    return truncateAddress(publicKey.toString());
  }

  copyCandyMachineAddress() {
    if (this.candyMachine?.address) {
      this.copyToClipBoard(this.candyMachine.address.toString());
    }
  }

  copyCreatorAddress(idx: number) {
    if (this.candyMachine?.creators[idx]) {
      this.copyToClipBoard(this.candyMachine.creators[idx].address.toString());
    }
  }

  copyToClipBoard(string: string) {
    if (this.clipboard.copy(string)) {
      this.snackService.showSuccess('Copied!');
    }
  }
}
