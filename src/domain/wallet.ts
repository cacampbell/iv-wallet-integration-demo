// "Wallet"
// Can either have a private key or a public key + signer callback
export interface Wallet {
  networkName: string;
  accountId: string;
  privateKey?: string;
  publicKey?: string;
  signer?: (message: Uint8Array) => Promise<Uint8Array>;
}
