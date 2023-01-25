export const RPC_URL_MAINNET =
  'https://hidden-spring-patina.solana-mainnet.quiknode.pro/df38f814f2059e95eb4d8e00fdbcb1f22a4d896e/';
export const RPC_URL_DEVNET =
  'https://white-methodical-panorama.solana-devnet.quiknode.pro/1364f7de58b5bde7cfa1f93f5d98b98446dacf23/';

export const METAPLEX_ABORT_TIMEOUT: number = 60 * 1000;

export const BUNDLR_CONFIG_MAINNET = {
  address: 'https://node1.bundlr.network',
  providerUrl: RPC_URL_MAINNET,
  timeout: METAPLEX_ABORT_TIMEOUT,
};

export const BUNDLR_CONFIG_DEVNET = {
  address: 'https://devnet.bundlr.network',
  providerUrl: RPC_URL_DEVNET,
  timeout: METAPLEX_ABORT_TIMEOUT,
};

export const DEFAULT_PRE_REVEAL_URL = 'https://arweave.net/placeholder';

export const EMPTY_STRING: string = '';

export const FILE_TYPE_PNG: string = 'image/png';
export const FILE_TYPE_JPG: string = 'image/jpg';
export const FILE_TYPE_JPEG: string = 'image/jpeg';
export const FILE_TYPE_GIF: string = 'image/gif';
export const FILE_TYPE_JSON: string = 'application/json';
