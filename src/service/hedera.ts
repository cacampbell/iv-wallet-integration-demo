import type { Client } from "@hashgraph/sdk";
import { Token } from "../domain/token";
import { Wallet } from "../domain/wallet";

export async function constructClient(wallet: Wallet): Promise<Client | null> {
  const { Client } = await import("@hashgraph/sdk");
  let client: Client | null = null;
  
  switch (wallet.networkName) {
    case "Testnet":
      client = Client.forTestnet();
      break;
    case "Mainnet":
      client = Client.forMainnet();
      break;
    case "Previewnet":
      client = Client.forPreviewnet();
      break;
  }

  if (client != null) {
    if (wallet.privateKey != null) {
      client.setOperator(wallet.accountId, wallet.privateKey);
    } else if (wallet.signer != null && wallet.publicKey != null) {
      client.setOperatorWith(wallet.accountId, wallet.publicKey, wallet.signer);
    } else {
      return null;
    }
  }

  return client;
}

export async function testWallet(wallet: Wallet): Promise<boolean | undefined> {
  const client = await constructClient(wallet);
  
  if (client != null) {
    const { TransferTransaction, Hbar, Status } = await import("@hashgraph/sdk");

    try {
      const loginTx = new TransferTransaction()
        .setMaxTransactionFee(Hbar.fromTinybars(1))
        .addHbarTransfer(wallet.accountId, 0);
      await (await (loginTx.execute(client))).getReceipt(client);
    } catch (error) {
      if (error.name === "StatusError") {
        if (error.message != null) {
          if (
            error.message.includes(Status.InsufficientTxFee.toString()) ||
            error.message.includes(Status.InsufficientPayerBalance.toString())
          ) {
            // If the transaction fails with Insufficient Tx Fee, this means
            // that the account ID verification succeeded before this point
            // Same for Insufficient Payer Balance
            return true;
          }
        }
      }

      throw error;
    }
  } else {
    throw new Error("Could not construct Hedera Client");
  }
}

export async function getHbarBalance(
  wallet: Wallet
): Promise<import("@hashgraph/sdk").Hbar | null> {
  const { AccountBalanceQuery } = await import(
    /* webpackChunkName: "hashgraph" */ "@hashgraph/sdk"
  );

  const client = await constructClient(wallet);
  return (
    await new AccountBalanceQuery().setAccountId(wallet.accountId).execute(client!)
  ).hbars;
}

export async function getTokenBalances(
  wallet: Wallet
): Promise<Token[] | null> {
  const { AccountBalanceQuery } = await import(
    /* webpackChunkName: "hashgraph" */
    "@hashgraph/sdk"
  );

  const client = await constructClient(wallet);
  const tokenBalances = (
    await new AccountBalanceQuery().setAccountId(wallet.accountId).execute(client!)
  ).tokens;

  if (tokenBalances != null) {
    const keys = [...tokenBalances.keys()];
    const balances = [...tokenBalances.values()];

    const tokens: Token[] = [];
    for (const [i, element] of keys.entries()) {
      tokens.push({
        id: element,
        balance: balances[i],
        decimals: 0 // Assume 0 for NFTs
      });
    }

    return tokens;
  }

  return null;
}