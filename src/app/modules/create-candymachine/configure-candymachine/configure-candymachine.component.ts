import { Component, OnInit } from '@angular/core';
import { Adapter } from '@solana/wallet-adapter-base';
import { MetaplexService } from 'src/app/service/metaplex.service';
import { SnackService } from 'src/app/service/snack.service';
import { WalletService } from 'src/app/service/wallet.service';

@Component({
  selector: 'app-configure-candymachine',
  templateUrl: './configure-candymachine.component.html',
  styleUrls: ['./configure-candymachine.component.css']
})
export class ConfigureCandymachineComponent implements OnInit {
  walletAdapter: Adapter | null = null;
  rpcEndpoint: string | null = null;

  constructor(
    private walletService: WalletService,
    private mxService: MetaplexService,
    private snackService: SnackService
  ) { }

  ngOnInit(): void {
    this.walletService.walletStore$.wallet$.subscribe(
      (wallet) => { this.walletAdapter = wallet?.adapter }
    );
    this.walletService.connectionStore$.state$.subscribe(
      (state) => { this.rpcEndpoint = state.endpoint }
    );
  }

  createCandyMachine() {
    if (this.validateUserConnection()) {
      this.snackService.showSuccess('Creating candymachine');
    }
  }

  validateUserConnection(): boolean {
    // Validate wallet is connected
    if (this.walletAdapter?.connected && this.walletAdapter?.publicKey) {
      if (this.rpcEndpoint) {
        // Validate rpcEndpoint and wallet matches metaplex instance
        if (this.mxService.validateInstance(this.rpcEndpoint, this.walletAdapter)) {
          return true;
        } else {
          this.snackService.showError(
            'Error connecting to network, please disconnect, reload and try again'
          );
          return false;
        }
      } else {
        this.snackService.showError('Rpc error, please reload and try again');
        return false;
      }
    } else {
      this.snackService.showError('Wallet not connected');
      return false;
    }
  }
}
