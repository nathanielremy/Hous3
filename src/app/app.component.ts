import { Component } from '@angular/core';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletService } from "./service/wallet.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EraMeta';
  iconifyScriptElement: HTMLScriptElement;

  constructor(private walletService: WalletService) {
    this.iconifyScriptElement = document.createElement('script');
    this.iconifyScriptElement.src =
      'https://code.iconify.design/2/2.0.4/iconify.min.js';
    document.body.appendChild(this.iconifyScriptElement);
  }

  ngOnInit(): void {
    this.walletService.connectionStore$.setEndpoint(this.walletService.clusterUrl);
    this.walletService.walletStore$.setAdapters([
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolongWalletAdapter(),
    ]);
  }
}
