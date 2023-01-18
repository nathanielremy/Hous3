import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  CandyGuardsSettings,
  CandyMachine,
  CandyMachineConfigLineSettings,
  CandyMachineHiddenSettings,
  CreateCandyMachineInput,
  isNft,
  isNftWithToken,
  MetaplexError,
  Nft,
  NftWithToken,
  sol,
  toBigNumber
} from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import { Adapter } from '@solana/wallet-adapter-base';
import { MetaplexService } from 'src/app/service/metaplex.service';
import { SnackService } from 'src/app/service/snack.service';
import { WalletService } from 'src/app/service/wallet.service';
import { isValidSolanaAddress, truncateAddress } from 'src/app/common/utils/utils';

@Component({
  selector: 'app-configure-candymachine',
  templateUrl: './configure-candymachine.component.html',
  styleUrls: ['./configure-candymachine.component.css']
})
export class ConfigureCandymachineComponent implements OnInit {
  @Input() candyMachine: CandyMachine | null = null;
  @Output() candyMachineEmitter = new EventEmitter<CandyMachine>();

  walletAdapter: Adapter | null = null;
  rpcEndpoint: string | null = null;

  isCreatingCandyMachine: boolean = false;
  isValidatingCollectionNft: boolean = false;

  // candyMachineSettings inputs
  royalty: number;
  supply: number;
  symbol: string = '';
  isMutable: boolean = true;
  creators: {
    address: string,
    verified: boolean,
    share: number
  }[] = [];

  // itemSettings inputs
  isItemSettingsHidden: boolean = false;
  nftName: string = '';
  isNftNameIndexed: boolean = false;
  isMintSequential: boolean = false;

  // Collection Nft inputs
  collectionNftAddress: string = '';
  collectionNft: Nft | NftWithToken | null = null;

  constructor(
    private walletService: WalletService,
    private mxService: MetaplexService,
    private snackService: SnackService
  ) { }

  get updateAuthorityPlaceholder(): string {
    return this.walletAdapter?.publicKey
      ? truncateAddress(this.walletAdapter?.publicKey?.toString())
      : 'Connect wallet';
  }

  get canValidateCollectionNft(): boolean {
    return !this.isValidatingCollectionNft && !this.isCreatingCandyMachine;
  }

  get compareCollectionNftUpdateAuthority(): boolean {
    return this.collectionNft
      ? this.mxService.compareIdentity(this.collectionNft.updateAuthorityAddress)
      : false;
  }

  ngOnInit(): void {
    this.walletService.walletStore$.wallet$.subscribe(
      (wallet) => { this.walletAdapter = wallet?.adapter }
    );
    this.walletService.connectionStore$.state$.subscribe(
      (state) => { this.rpcEndpoint = state.endpoint }
    );
  }

  addCreator() {
    for (let creator of this.creators) {
      if (!isValidSolanaAddress(creator.address)) {
        this.snackService.showError(
          'Please enter a valid Solana wallet address'
        );
        return;
      }
    }
    if (this.creators.length < 4) {
      this.creators.push({
        address: '',
        verified: true,
        share: 0
      })
    }
  }

  deleteCreator(idx: number) {
    this.creators.splice(idx, 1);
  }

  async validateCollectionNft() {
    if (!this.canValidateCollectionNft) return;

    if (this.validateUserConnection()) {
      if (
        !this.collectionNftAddress.trim() ||
        !isValidSolanaAddress(this.collectionNftAddress)
      ) {
        this.snackService.showWarning('Please enter a valid Solana Nft address');
        return;
      }

      this.isValidatingCollectionNft = true;

      try {
        const nft = await this.mxService.getNft(new PublicKey(this.collectionNftAddress), true);
        if (isNft(nft) || isNftWithToken(nft)) {
          this.collectionNft = nft;
        } else {
          this.collectionNft = null;
          this.snackService.showError('Token does not follow the Nft standard');
        }
      }
      catch (err) {
        this.snackService.showError(
          `${(err instanceof MetaplexError) ? (err.cause ?? 'Account not found') : err}`
        );
        console.log(`err: ${err}`);
      }

      this.isValidatingCollectionNft = false;
    }
  }

  replaceCollectionNft() {
    this.collectionNftAddress = '';
    this.collectionNft = null;
  }

  setItemSettingsHidden(hidden: boolean) {
    this.isItemSettingsHidden = hidden;
  }

  async createCandyMachine() {
    if (this.validateUserConnection()) {
      try {
        const candyMachineSettings = this.constructCandyMachineSettings();
        if (candyMachineSettings) {
          const candyMachine = await this.mxService.createCandyMachine(candyMachineSettings);
          this.candyMachine = candyMachine.candyMachine;
          this.candyMachineEmitter.emit(candyMachine.candyMachine);
          console.log(`CANDYMACHINE: ${JSON.stringify(this.candyMachine)}`);
        } else {
          // Do nothing
        }
      }
      catch (err) {
        this.snackService.showError(
          `${(err instanceof MetaplexError) ? (err.cause ?? 'RPC error, keep trying..') : err}`
        );
        console.log(`err: ${err}`);
      }
    }
  }

  constructCandyMachineSettings(): CreateCandyMachineInput | null {
    if (!this.royalty || this.royalty < 0 || this.royalty > 10) {
      this.snackService.showWarning('Please enter a royalty percentage between 0 - 10%');
      return null;
    }

    if (!this.supply || this.supply < 0 || this.supply > 10000) {
      this.snackService.showWarning('Please enter a supply between 0 - 10k');
      return null;
    }

    if (this.supply != Math.round(this.supply)) {
      this.snackService.showWarning('Supply must be a round number');
      return null;
    }

    if (!this.symbol.trim() || this.symbol.length > 10) {
      this.snackService.showWarning('Please enter a valid symbol. Max 10 characters');
      return null;
    }

    if (this.creators.length < 5) {
      var sumOfCreatorShares = 0;
      for (let creator of this.creators) {
        if (!isValidSolanaAddress(creator.address)) {
          this.snackService.showWarning(
            'Please enter valid Solana wallet addresses for creators'
          );
          return null;
        }
        sumOfCreatorShares += creator.share;
      }
      if (
        this.creators.length > 0 &&
        (sumOfCreatorShares < 100 || sumOfCreatorShares > 100)
      ) {
        this.snackService.showWarning('Creator shares must sum up to 100%');
        return null;
      }
    } else {
      this.snackService.showWarning('Please enter 4 or less creators');
      return null;
    }

    if (!this.collectionNft || !this.compareCollectionNftUpdateAuthority) {
      this.snackService.showWarning('Collection Nft has not been validated');
      return null;
    }

    const itemSettings = this.constructCandyMachineItemSettings();
    if (!itemSettings || itemSettings == null) return null;

    const guards = this.constructCandyMachineGuards();
    if (!guards || guards == null) return null;

    const candyMachineSettings = {
      authority: this.mxService.getIdentity(),
      collection: {
        address: this.collectionNft.address,
        updateAuthority: this.mxService.getIdentity()
      },
      sellerFeeBasisPoints: Math.trunc(this.royalty * 100),
      itemsAvailable: toBigNumber(this.supply),
      itemSettings: itemSettings,
      symbol: this.symbol,
      maxEditionSupply: toBigNumber(0),
      isMutable: this.isMutable,
      creators: this.creators.map((creator) => {
        return {
          address: new PublicKey(creator.address),
          verified: creator.verified,
          share: creator.share
        }
      }),
      guards: guards
    };

    return candyMachineSettings;
  }

  constructCandyMachineItemSettings(
  ): CandyMachineHiddenSettings | CandyMachineConfigLineSettings | null {
    if (!this.nftName.trim() || this.nftName.length > 29) {
      this.snackService.showWarning('Please enter a valid Nft name. Max 29 characters');
      return null;
    }

    if (this.isItemSettingsHidden) {
      return {
        type: 'hidden',
        name: this.nftName + (this.isNftNameIndexed ? ' #$ID+1$' : ''),
        uri: 'https://arweave.net/placeholder',
        hash: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      } as CandyMachineHiddenSettings;
    } else {
      return {
        type: 'configLines',
        prefixName: this.nftName + (this.isNftNameIndexed ? ' #$ID+1$' : ''),
        nameLength: 0,
        prefixUri: 'https://arweave.net/',
        uriLength: 43,
        isSequential: this.isMintSequential
      } as CandyMachineConfigLineSettings;
    }
  }

  constructCandyMachineGuards(): CandyGuardsSettings | null {
    return {
      solPayment: { amount: sol(1.5), destination: this.mxService.getIdentity().publicKey }
    };
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
