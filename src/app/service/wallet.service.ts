import { Injectable } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletName } from '@solana/wallet-adapter-base';
import { BehaviorSubject } from 'rxjs';
import { RPC_URL_MAINNET } from "../common/constants";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private clusterUrlSource = new BehaviorSubject(RPC_URL_MAINNET);
  clusterUrl = this.clusterUrlSource.asObservable();

  readonly walletStore$ = this._walletStore;
  readonly connectionStore$ = this._connectionStore;

  constructor(
    private readonly _walletStore: WalletStore,
    private readonly _connectionStore: ConnectionStore
  ) { }

  changeClusterUrl(url: string) {
    this.clusterUrlSource.next(url);
  }

  connectWallet(walletName: WalletName) {
    this._walletStore.selectWallet(walletName);
    return this._walletStore.connect();
  }

  disconnectWallet() {
    return this._walletStore.disconnect();
  }
}
