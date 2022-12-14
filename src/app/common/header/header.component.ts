import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Adapter, WalletName } from '@solana/wallet-adapter-base';
import { SnackService } from 'src/app/service/snack.service';
import { WalletService } from 'src/app/service/wallet.service';
import { RPC_URL_DEVNET, RPC_URL_MAINNET } from '../constants';
import { truncateAddress } from '../utils/utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {
    '(document:click)': 'onClickDocument($event)',
  },
})
export class HeaderComponent implements OnInit {
  @ViewChild('toggleMenu') toggleMenu: ElementRef;

  walletAdapter: Adapter | null = null;

  isWalletSelectorOpen: boolean = false;
  isShowingMenu: boolean = false;

  constructor(
    private snackService: SnackService,
    private walletService: WalletService,
    private domSanitizer: DomSanitizer
  ) { }

  get isWalletConnected(): boolean {
    return this.walletAdapter?.connected && this.walletAdapter?.publicKey;
  }

  get truncatedAddress(): string {
    return truncateAddress(this.walletAdapter?.publicKey?.toString());
  }

  get walletIconSafeUrl(): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(this.walletAdapter?.icon ?? '');
  }

  get currentCluster(): string {
    let cluster = 'Unknown';
    this.walletService.connectionStore$.state$.subscribe(
      (state) => {
        cluster = state.endpoint === RPC_URL_MAINNET
          ? 'Mainnet'
          : state.endpoint === RPC_URL_DEVNET
          ? 'Devnet'
          : 'Unknown'
      }
    );
    return cluster;
  }

  ngOnInit(): void {
    this.walletService.walletStore$.wallet$.subscribe((wallet) => {
      this.walletAdapter = wallet?.adapter;
    });
  }

  openProfile() {
    this.snackService.showWarning('Open profile');
  }

  setClusterToMainnet() {
    this.walletService.changeClusterUrl(RPC_URL_MAINNET);
    this.showMenu(false);
  }

  setClusterToDevnet() {
    this.walletService.changeClusterUrl(RPC_URL_DEVNET);
    this.showMenu(false);
  }

  signOut() {
    this.walletService.disconnectWallet().subscribe();
  }

  onSelectWallet(walletName: WalletName) {
    this.walletService.connectWallet(walletName)
      .subscribe(
        (_) => {
          this.snackService.showSuccess(
            'Signed in'
          );
        },
        (_) => {
          this.snackService.showError(
            'Failed to sign in'
          );
        }
      );
    this.isWalletSelectorOpen = false;
  }

  openWalletSelector() {
    this.isWalletSelectorOpen = true;
  }

  closeWalletSelector(e: MouseEvent) {
    e.preventDefault();
    let target = e.target as HTMLElement;
    if (target.id !== 'closeModal') return;
    this.isWalletSelectorOpen = false;
  }

  onClickDocument(event: any) {
    if (!this.toggleMenu?.nativeElement.contains(event.target)) {
      this.showMenu(false);
    }
  }

  showMenu(show: boolean) {
    this.isShowingMenu = show;
  }
}
