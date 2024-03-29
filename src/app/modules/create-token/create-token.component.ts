import { Component, OnInit } from '@angular/core';
import { Adapter } from '@solana/wallet-adapter-base';
import {
  FILE_TYPE_GIF,
  FILE_TYPE_JPEG,
  FILE_TYPE_JPG,
  FILE_TYPE_PNG
} from 'src/app/common/constants';
import { SnackService } from 'src/app/service/snack.service';
import { WalletService } from 'src/app/service/wallet.service';
import { MetaplexService } from 'src/app/service/metaplex.service';
import { MetaplexError, token } from '@metaplex-foundation/js';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.css']
})
export class CreateTokenComponent implements OnInit {
  walletAdapter: Adapter | null = null;
  rpcEndpoint: string | null = null;

  selectedImageFile: File | null = null;
  selectedImageUrl: string | null = null;

  tokenName: string = '';
  tokenDescription: string = '';
  tokenSymbol: string = '';
  tokenUrl: string = '';
  tokenSupply: number = 0;
  decimals: number = -1;
  keepMintAuthority: boolean = false;
  keepFreezeAuthority: boolean = false;

  isCreatingToken: boolean = false;

  constructor(
    private snackService: SnackService,
    private walletService: WalletService,
    private mxService: MetaplexService
  ) { }

  ngOnInit(): void {
    this.walletService.walletStore$.wallet$.subscribe(
      (wallet) => { this.walletAdapter = wallet?.adapter }
    );
    this.walletService.connectionStore$.state$.subscribe(
      (state) => { this.rpcEndpoint = state.endpoint }
    );
  }

  openFileSelector(fileSelector: HTMLInputElement) {
    if (this.isCreatingToken) return;
    fileSelector.value = fileSelector.defaultValue;
    fileSelector.click();
  }

  onFileSelected(e: any) {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 10000000) {
        this.snackService.showError('Your file is too large. Max 10mb');
        return;
      }

      if (
        file.type !== FILE_TYPE_PNG &&
        file.type !== FILE_TYPE_JPG &&
        file.type !== FILE_TYPE_JPEG &&
        file.type !== FILE_TYPE_GIF
      ) {
        this.snackService.showError('Select a file of type jgp, png or gif');
        return;
      }

      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  setDecimals(idx: number) {
    if (this.isCreatingToken) return;
    this.decimals = idx;
  }

  async createToken() {
    if (this.isCreatingToken) return;

    if (!this.selectedImageFile) {
      this.snackService.showWarning('Please select an image for your token');
      return;
    }

    if (this.validateTokenConfig() && this.validateUserConnection()) {
      this.isCreatingToken = true;

      try {
        const offChainMetadata = {
          name: this.tokenName,
          symbol: this.tokenSymbol,
          description: this.tokenDescription,
          seller_fee_basis_points: 0,
          image: undefined,
          external_url: this.tokenUrl,
          attributes: undefined,
          properties: undefined,
          collection: {
            name: this.tokenName,
            family: this.tokenName,
          }
        };
        const sftInput = {
          updateAuthority: this.mxService.getIdentity(),
          mintAuthority: this.keepMintAuthority
            ? this.mxService.getIdentity()
            : Keypair.generate(),
          freezeAuthority: this.keepFreezeAuthority
            ? this.mxService.getIdentity().publicKey
            : null,
          useNewMint: Keypair.generate(),
          useExistingMint: undefined, // Defaults to creating a new mint account
          tokenOwner: this.mxService.getIdentity().publicKey,
          tokenAddress: undefined, // Defaults to creating and/or minting a new token account
          tokenAmount: token(this.tokenSupply, this.decimals, this.tokenSymbol),
          decimals: this.decimals,
          uri: '',
          name: this.tokenName,
          sellerFeeBasisPoints: 0,
          symbol: this.tokenSymbol,
          creators: undefined, // Defaults to update authority
          isMutable: true,
          uses: null, // No uses for this token
          isCollection: false,
          collection: null, // Belongs to no collection
          collectionAuthority: null, // Belongs to no collection
          collectionAuthorityIsDelegated: false, // Belongs to no collection
          collectionIsSized: false // Can mint more later
        };

        const sft = await this.mxService.createSft(
          sftInput,
          offChainMetadata,
          this.selectedImageFile
        );

        console.log(`Hardcoded mint address: ${sftInput.useNewMint.publicKey.toString()}`);
        console.log(`SFT: ${sft}`);
        console.log(`MINT ADDRESS: ${sft.mintAddress}`);
      }
      catch (err) {
        this.snackService.showError(
          `${(err instanceof MetaplexError) ? err.problem : err}`
        );
        console.log(`err: ${err}`);
      }

      this.isCreatingToken = false;
    }
  }

  validateTokenConfig(): boolean {
    if (!this.tokenName.trim() || this.tokenName.length > 32) {
      this.snackService.showWarning('Please enter a valid name. Max 32 characters');
      return false;
    }

    if (!this.tokenDescription.trim() || this.tokenDescription.length > 280) {
      this.snackService.showWarning('Please enter a valid description. Max 280 characters');
      return false;
    }

    if (!this.tokenSymbol.trim() || this.tokenSymbol.length > 10) {
      this.snackService.showWarning('Please enter a valid symbol. Max 10 characters');
      return false;
    }

    if (!this.tokenUrl.trim() || this.tokenUrl.length > 750) {
      this.snackService.showWarning('Please enter a valid url');
      return false;
    }

    try { new URL(this.tokenUrl) }
    catch (_) {
      this.snackService.showWarning('Please enter a valid url');
      return false;
    }

    if (this.tokenSupply < 1 || this.tokenSupply > LAMPORTS_PER_SOL) {
      this.snackService.showWarning('Please enter a valid supply between 1 - 1 billion');
      return false;
    }

    if (this.tokenSupply != Math.round(this.tokenSupply)) {
      this.snackService.showWarning('Supply must be a round number');
      return false;
    }

    if (
      this.decimals < 0 ||
      this.decimals > 9 ||
      this.decimals != Math.round(this.decimals)
    ) {
      this.snackService.showWarning('Please select a valid decimal');
      return false;
    }

    return true;
  }

  validateUserConnection(): boolean {
    // Validate wallet is connected
    if (this.walletAdapter?.connected && this.walletAdapter?.publicKey) {
      if (this.rpcEndpoint) {
        // Validate rpcEndpoint and wallet matches metaplex instance
        return this.mxService.validateInstance(this.rpcEndpoint, this.walletAdapter);
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
