import { Injectable } from '@angular/core';
import {
  Metaplex,
  bundlrStorage,
  WalletAdapter,
  walletAdapterIdentity,
  IdentityClient,
  toMetaplexFileFromBrowser,
  MetaplexFileOptions,
  MetaplexFile,
  UploadMetadataInput,
  OperationOptions,
  JsonMetadata,
  UploadMetadataOutput,
  CreateSftInput,
  CreateCandyMachineInput
} from '@metaplex-foundation/js';
import { Connection, PublicKey, Signer } from '@solana/web3.js';
import {
  RPC_URL_DEVNET,
  RPC_URL_MAINNET,
  BUNDLR_CONFIG_MAINNET,
  BUNDLR_CONFIG_DEVNET,
  METAPLEX_ABORT_TIMEOUT
} from '../common/constants';

const METAPLEX_MAINNET = Metaplex
  .make(new Connection(RPC_URL_MAINNET))
  .use(bundlrStorage(BUNDLR_CONFIG_MAINNET));

@Injectable({
  providedIn: 'root',
})
export class MetaplexService {
  private metaplex: Metaplex = METAPLEX_MAINNET;

  constructor() {}

  validateInstance(rpcEndpoint: string, walletAdapter: WalletAdapter): boolean {
    if (!walletAdapter.publicKey) return false;
    if (
      this.metaplex.connection.rpcEndpoint === rpcEndpoint &&
      this.compareIdentity(walletAdapter.publicKey)
    ) {
      return true;
    }
    if (
      rpcEndpoint === RPC_URL_MAINNET ||
      rpcEndpoint === RPC_URL_DEVNET
    ) {
      this.metaplex = rpcEndpoint === RPC_URL_MAINNET
        ? Metaplex
          .make(new Connection(RPC_URL_MAINNET))
          .use(bundlrStorage(BUNDLR_CONFIG_MAINNET))
        : Metaplex
          .make(new Connection(RPC_URL_DEVNET))
          .use(bundlrStorage(BUNDLR_CONFIG_DEVNET));
      return (
        this.metaplex.connection.rpcEndpoint === rpcEndpoint &&
        this.setIdentity(walletAdapter)
      );
    } else {
      return false;
    }
  }

  getIdentity(): IdentityClient {
    return this.metaplex.identity();
  }

  setIdentity(walletAdapter: WalletAdapter): boolean {
    if (!walletAdapter.publicKey) return false;
    try {
      this.metaplex.use(walletAdapterIdentity(walletAdapter));
      return this.compareIdentity(walletAdapter.publicKey);
    } catch (_) {
      return false;
    }
  }

  compareIdentity(identity: PublicKey | Signer): boolean {
    try { return this.getIdentity().equals(identity) }
    catch (_) { return false }
  }

  async createMetaplexFile(
    file: File, options?: MetaplexFileOptions
  ): Promise<MetaplexFile> {
    return toMetaplexFileFromBrowser(file, options);
  }

  async uploadNftMetadata(
    metadata: UploadMetadataInput, file?: File
  ): Promise<UploadMetadataOutput> {
    const abortController: AbortController = new AbortController();
    setTimeout(() => abortController.abort(), METAPLEX_ABORT_TIMEOUT);

    const options: OperationOptions = {
      payer: this.getIdentity(),
      commitment: 'confirmed',
      signal: abortController.signal
    };

    return this.metaplex.nfts().uploadMetadata(
      {
        ...metadata,
        ...{
          image: file ? await this.createMetaplexFile(file) : undefined
        }
      },
      options
    );
  }

  async createSft(sftInput: CreateSftInput, offChainMetadata: JsonMetadata, file: File) {
    const sftMetadata = await this.uploadNftMetadata(offChainMetadata, file);
    sftInput.uri = sftMetadata.uri;

    const abortController: AbortController = new AbortController();
    setTimeout(() => abortController.abort(), METAPLEX_ABORT_TIMEOUT);

    const options: OperationOptions = {
      payer: this.getIdentity(),
      commitment: 'confirmed',
      signal: abortController.signal
    };

    return this.metaplex.nfts().createSft(sftInput, options);
  }

  createCandyMachine(candyMachineSettings: CreateCandyMachineInput) {
    const abortController: AbortController = new AbortController();
    setTimeout(() => abortController.abort(), METAPLEX_ABORT_TIMEOUT);

    const options: OperationOptions = {
      payer: this.getIdentity(),
      commitment: 'confirmed',
      signal: abortController.signal
    };

    return this.metaplex.candyMachines().create(candyMachineSettings, options);
  }
}
