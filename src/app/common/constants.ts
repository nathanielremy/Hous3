export const RPC_URL_MAINNET =
  'https://fragrant-twilight-morning.solana-mainnet.quiknode.pro/45ce0532a6a5011db8b8f97d87b380050cc37a5f/';
export const RPC_URL_DEVNET =
  'https://burned-omniscient-isle.solana-devnet.quiknode.pro/d3c9c4d1afe726d96aa034f6249ed7b50ca8cea3/';

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

export const EMPTY_STRING: string = '';

export const FILE_TYPE_PNG: string = 'image/png';
export const FILE_TYPE_JPG: string = 'image/jpg';
export const FILE_TYPE_JPEG: string = 'image/jpeg';
export const FILE_TYPE_GIF: string = 'image/gif';
