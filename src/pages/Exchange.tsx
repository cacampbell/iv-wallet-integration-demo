import React, { useContext, useState } from "react";
import { Wallet } from "../domain/wallet";
import { Asset } from "../domain/asset";
import { constructClient, getBalances, testWallet } from "../service/hedera";
import AssetInput from "../components/Base/AssetInput";
import Balances from "../components/Base/Balances";
import Button from "../components/Base/Button";
import { UserWalletContext } from "../App";
import { Hbar } from "@hashgraph/sdk";

// Context: Store Balance Info as Map<id, Asset[]>
// Populate as Accounts are loaded
// Access in children via useContext
export const BalancesContext = React.createContext({} as Map<string, Asset[]>);

// Component Definition
const Exchange: React.FC = () => {
  // Context
  const userWallet = useContext(UserWalletContext);

  // State
  const [externalWallet, setExternalWallet] = useState({} as Wallet);
  const [error, setError] = useState(null as string | null);
  const [keysAssociated, setKeysAssociated] = useState(null as boolean | null);
  const [balances, setBalances] = useState(new Map() as Map<string, Asset[]>);
  
  // State (Transfer Form)
  const [internalAsset, setInternalAsset] = useState("Hbar");
  const [externalAsset, setExternalAsset] = useState("Hbar");
  const [internalRawAmount, setInternalRawAmount] = useState("");
  const [externalRawAmount, setExternalRawAmount] = useState("");
  const [importError, setImportError] = useState("");
  const [exportError, setExportError] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);

  // Handlers
  async function handleConnect(): Promise<void> {
    setError(null);
    // @ts-ignore
    if (window.wallet != null && userWallet.networkName != null) {
      try {
        // @ts-ignore
        const wallet = window.wallet;
        const account = await wallet.login(userWallet.networkName);
        const externalWallet = {
          networkName: userWallet.networkName,
          accountId: account.id,
          publicKey: account.publicKey,
          signer: wallet.getTransactionSigner()
        }
        setExternalWallet(externalWallet);
      } catch (error) {
        setError(error.message);
      }
    }
  }

  async function handleFetchBalances(): Promise<void> {
    // Don't want to request signature externally for balance queries
    const proxyExternalWallet = {
      accountId: externalWallet.accountId,
      networkName: userWallet.networkName,
      privateKey: userWallet.privateKey
    }
    
    const newBalances = new Map() as Map<string, Asset[]>;
    newBalances.set(
      userWallet.accountId.toString(),
      await getBalances(userWallet)
    );
    
    if (userWallet.accountId !== proxyExternalWallet.accountId) {
      newBalances.set(
        proxyExternalWallet.accountId.toString(),
        await getBalances(proxyExternalWallet)
      );
    }

    setBalances(newBalances);
  }

  async function handleVerifyKeys(): Promise<void> {
    setError(null);
    setKeysAssociated(null);

    // Internal Key, External Account
    const crossWallet = {
      networkName: userWallet.networkName,
      accountId: externalWallet.accountId,
      privateKey: userWallet.privateKey
    };
    
    if (userWallet.accountId != null && externalWallet.accountId != null) {
      try {
        await testWallet(userWallet);
        await testWallet(crossWallet);
        setKeysAssociated(true);
      } catch (error) {
        setError(error.message);
        setKeysAssociated(false);
      }
    }
  }

  function handleInternalAssetChange(value: string): void {
    setInternalAsset(value);
  }

  function handleInternalAmountChange(value: string): void {
    setInternalRawAmount(value);
  }

  async function handleExport(): Promise<void> {
    setExportError("");
    
    if (internalAsset === "" || internalRawAmount === "") {
      setExportError("Please select an asset and enter an amount.");
      return;
    }

    try {
      setExportBusy(true);
      const { TokenId, Hbar, TransferTransaction, TokenAssociateTransaction } = await import("@hashgraph/sdk");
      const client = await constructClient(userWallet);
      if (client == null) {
        throw new Error("Could not construct client for user wallet");
      }
      
      if (internalAsset === "Hbar") {
        // transfer hbar
        const hbar = new Hbar(parseInt(internalRawAmount));
        const transfer = new TransferTransaction()
          .setMaxTransactionFee(new Hbar(1))
          .setTransactionMemo("Export Asset")
          .addHbarTransfer(userWallet.accountId, hbar.negated())
          .addHbarTransfer(externalWallet.accountId, hbar);
        await (await transfer.execute(client)).getReceipt(client);
      } else {
        const token = TokenId.fromString(internalAsset);
        const amount = parseInt(internalRawAmount);

        // Associate Token
        try {        
          const associate = new TokenAssociateTransaction()
            .setAccountId(externalWallet.accountId)
            .setTokenIds([token])
            .setMaxTransactionFee(new Hbar(1));
          await (await associate.execute(client)).getReceipt(client);
        } catch (error) {
          if (!error.message.includes("TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT")) {
            throw error;
          }
        }
        
        const transfer = new TransferTransaction()
          .setMaxTransactionFee(new Hbar(1))
          .setTransactionMemo("Export Asset")
          .addTokenTransfer(token, userWallet.accountId, -amount)
          .addTokenTransfer(token, externalWallet.accountId, amount);
        await (await transfer.execute(client)).getReceipt(client);
      }
    } catch (error) {
      setExportError(error.message);
    } finally {
      await handleFetchBalances();
      setExportBusy(false);
    }
  }

  function handleExternalAssetChange(value: string): void {
    setExternalAsset(value);
  }

  function handleExternalAmountChange(value: string): void {
    setExternalRawAmount(value);
  }

  async function handleImport(): Promise<void> {
    setImportError("");
    
    if (externalAsset === "" || externalRawAmount === "") {
      setImportError("Please select an asset and enter an amount.");
      return;
    }

    try {
      setImportBusy(true);
      const { TokenId, Hbar, TransferTransaction, TokenAssociateTransaction } = await import("@hashgraph/sdk");
      const client = await constructClient(externalWallet);
      if (client == null) {
        throw new Error("Could not construct client for external wallet");
      }
      
      if (externalAsset === "Hbar") {
        // transfer hbar
        const hbar = new Hbar(parseInt(externalRawAmount));
        const transfer = new TransferTransaction()
          .setMaxTransactionFee(new Hbar(1))
          .setTransactionMemo("Import Asset")
          .addHbarTransfer(userWallet.accountId, hbar)
          .addHbarTransfer(externalWallet.accountId, hbar.negated());
        await (await transfer.execute(client)).getReceipt(client);
      } else {
        const token = TokenId.fromString(externalAsset);
        const amount = parseInt(externalRawAmount);

        // Associate Token
        try {        
          const associate = new TokenAssociateTransaction()
            .setAccountId(userWallet.accountId)
            .setTokenIds([token])
            .setMaxTransactionFee(new Hbar(1));
          await (await associate.execute(client)).getReceipt(client);
        } catch (error) {
          if (!error.message.includes("TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT")) {
            throw error;
          }
        }
        
        const transfer = new TransferTransaction()
          .setMaxTransactionFee(new Hbar(1))
          .setTransactionMemo("Import Asset")
          .addTokenTransfer(token, userWallet.accountId, amount)
          .addTokenTransfer(token, externalWallet.accountId, -amount);
        await (await transfer.execute(client)).getReceipt(client);
      }
    } catch (error) {
      setImportError(error.message);
    } finally {
      await handleFetchBalances();
      setImportBusy(false);
    }
  }

  // Elements
  const walletDisplay = (wallet: Wallet) => {
    const privateKey = () => {
      if (wallet.privateKey != null) {
        return (<div className="flex flex-col w-full">
          <span className="w-full font-semibold">Private Key</span>
          
          {wallet.privateKey}
        </div>);
      }

      return null;
    }

    const publicKey = () => {
      if (wallet.publicKey != null) {
        return (<div className="flex flex-col w-full">
          <span className="w-full font-semibold">Public Key</span>
          
          {wallet.publicKey}
        </div>);
      }

      return null;
    }

    const signer = () => {
      if (wallet.signer != null) {
        return (<div className="flex flex-col w-full italic font-semibold">External Signer</div>);
      }
    }
    
    return (
      <div className="flex flex-col items-start w-full h-full p-4 m-4 break-all bg-gray-200 justify-items-center">
        <div className="flex w-full break-normal border border-t-0 border-l-0 border-r-0 border-black"><span className="w-full font-semibold">Network</span>{wallet.networkName}</div>
        <div className="flex w-full break-normal border border-t-0 border-l-0 border-r-0 border-black"><span className="w-full font-semibold">Account</span>{wallet.accountId}</div>
        { privateKey() }
        { signer() }
        { publicKey() }
      </div>
    );
  }

  const internalWalletDisplay = () => {
    const wallet = () => {
      if (userWallet.accountId != null) {
        return walletDisplay(userWallet);
      }

      return ("No Wallet Loaded");
    }
    
    return (
      <div className="flex flex-col items-center w-96">
        <div className="p-2 text-xl font-semibold">
          Internal Wallet Information
        </div>
      
        {wallet()}
      </div>
    );
  }

  const externalWalletDisplay = () => {
    const wallet = () => {
      if (externalWallet.accountId != null) {
        return walletDisplay(externalWallet);
      }

      return ("No Wallet Loaded");
    }
    
    return (
      <div className="flex flex-col items-center w-96">
        <div className="p-2 text-xl font-semibold">
          External Wallet Information
        </div>
      
        {wallet()}
      
        <Button onClick={handleConnect} disabled={externalWallet.accountId != null}>
          Connect IV Wallet
        </Button>
      </div>
    );
  }

  const errorDisplay = () => {
    if (error != null) {
      return (<div className="p-4 text-2xl font-bold text-red-400">{error}</div>);
    }

    return null;
  }

  const keysAssociatedDisplay = () => {
    if (keysAssociated != null) {
      if (keysAssociated) return (<div className="py-2 font-semibold text-green-400">😃 Yup</div>);
      return (<div className="py-2 font-semibold text-red-400">😅 Nope</div>)
    }

    return null;
  }

  const controlsDisplay = () => {
    if (userWallet.accountId != null && externalWallet.accountId != null) {
      return (
        <>
        <Button
          onClick={handleVerifyKeys}
          disabled={userWallet.accountId == null || externalWallet.accountId == null}
        >
          Is Internal Key Associated With Both Accounts?
        </Button>
        
        { keysAssociatedDisplay() ?? <div className="py-2" /> }
        
        <Button
          onClick={handleFetchBalances}
          disabled={userWallet.accountId == null || externalWallet.accountId == null}
        >
          Refresh Balances
        </Button>
        </>
      );
    }

    return null;
  }

  const balancesDisplay = () => {
    function externalBalance() {
      if (userWallet.accountId !== externalWallet.accountId) {
        return (
          <>
          <div className="px-10" />
          
          <Balances id={externalWallet.accountId.toString()} />
          </>
        );
      }

      return null;
    }
    
    if (keysAssociated) {
      return (
        <>
        <Balances id={userWallet.accountId.toString()} />
        { externalBalance() }
        </>
      );
    }

    return null;
  }

  const exportErrorDisplay = () => {
    if (exportError.length > 0) {
      return exportError;
    }

    return null;
  }

  const importErrorDisplay = () => {
    if (importError.length > 0) {
      return importError;
    }

    return null;
  }

  const transferForm = () => {
    if (keysAssociated) {
      if (userWallet.accountId === externalWallet.accountId) {
        return (
          <div className="p-10 italic font-semibold text-red-400">
            {`Same Account ID (${userWallet.accountId.toString()}) for Internal and External Account. Cannot Transfer Assets.`}
          </div>
        );
      }

      return (
        <>
        <div className="flex flex-col items-center justify-center">
          <div className="p-2 text-xl font-semibold">
            Export Assets
          </div>
        
          <AssetInput
            id={userWallet.accountId.toString()}
            onChangeAsset={handleInternalAssetChange}
            onChangeAmount={handleInternalAmountChange}
          />

          <div className="p-2" />
        
          <Button 
            disabled={exportBusy} 
            onClick={handleExport}
          >
            Export
          </Button>

          <div className="flex items-center justify-center pt-4 text-sm italic font-semibold text-red-400 w-96">
            {exportErrorDisplay()}
          </div>
        </div>
        
        <div className="p-10" />

        <div className="flex flex-col items-center justify-center">
          <div className="p-2 text-xl font-semibold">
            Import Assets
          </div>
          
          <AssetInput
            id={externalWallet.accountId.toString()}
            onChangeAsset={handleExternalAssetChange}
            onChangeAmount={handleExternalAmountChange}
          />

          <div className="p-2" />

          <Button 
            disabled={importBusy} 
            onClick={handleImport}
          >
            Import
          </Button>

          <div className="flex items-center justify-center pt-4 text-sm italic font-semibold text-red-400 w-96">
            {importErrorDisplay()}
          </div>
        </div>
        </>
      );
    }

    return null;
  }

  const balancesAndTransfersDisplay = () => {
    if (balances.get(userWallet.accountId.toString()) != null &&
      balances.get(externalWallet.accountId.toString()) != null) {
        return (
          <BalancesContext.Provider value={balances}>
            <div className="flex items-start justify-center w-full">
              { transferForm() }
            </div>

            <div className="flex items-start justify-center w-full pt-6">
              { balancesDisplay() }
            </div>
          </BalancesContext.Provider>
        );
    }

    return null;
  }

  // View
  return (
    <div className="flex flex-col items-center w-full p-10 justify-items-center">
      { errorDisplay() }
      
      <div className="flex items-start justify-center w-full">
        {internalWalletDisplay()}
        
        <div className="px-10" />
        
        {externalWalletDisplay()}
      </div>
      
      <div className="flex flex-col items-center justify-center w-full m-10">
        { controlsDisplay() }
      </div>

      { balancesAndTransfersDisplay() }
    </div>
  );
}

export default Exchange;
