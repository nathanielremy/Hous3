import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletName } from '@solana/wallet-adapter-base';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-wallet-selector',
  templateUrl: './wallet-selector.component.html',
  styleUrls: ['./wallet-selector.component.css'],
})
export class WalletSelectorComponent implements OnInit {
  iconifyScriptElement: HTMLScriptElement;

  @Input() isModalOpen: Boolean = false;
  @Output() closeEvent = new EventEmitter<MouseEvent>();
  @Output() walletNameEmitter = new EventEmitter<WalletName>();

  readonly wallets$ = this._walletStore.wallets$;
  domSanitizer: DomSanitizer;

  constructor(
    private sanitizer: DomSanitizer,
    private readonly _walletStore: WalletStore
  ) {
    this.domSanitizer = sanitizer;
  }

  ngOnInit(): void {}

  closeModal(e: MouseEvent) {
    let target = e.target as HTMLElement;
    if (target.id !== 'closeModal') {
      return;
    }

    this.closeEvent.emit(e);
  }

  emitWalletName(name: WalletName) {
    this.walletNameEmitter.emit(name);
  }

  downloadPhantom() {
    window.open('https://phantom.app/download');
  }
}
