import React, { useContext, useState } from "react";
import { Wallet } from "../domain/wallet";
import { testWallet } from "../service/hedera";
import Balances from "../components/Base/Balances";
import Button from "../components/Base/Button";
import { UserWalletContext } from "../App";

// Component Definition
const Exchange: React.FC = () => {
  // Context
  const userWallet = useContext(UserWalletContext);

  // State
  const [externalWallet, setExternalWallet] = useState({} as Wallet);
  const [error, setError] = useState(null as string | null);
  const [keysAssociated, setKeysAssociated] = useState(null as boolean | null);

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

  // Elements
  const walletDisplay = (wallet: Wallet) => {
    const privateKey = () => {
      if (wallet.privateKey != null) {
        return (<div className="flex flex-col w-full">
          <span className="font-semibold w-52">Private Key</span>{wallet.privateKey}
        </div>);
      }

      return null;
    }

    const publicKey = () => {
      if (wallet.publicKey != null) {
        return (<div className="flex flex-col w-full">
          <span className="font-semibold w-52">Public Key</span>{wallet.publicKey}
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
        <div className="flex w-full border border-t-0 border-l-0 border-r-0 border-black"><span className="font-semibold w-52">Network</span>{wallet.networkName}</div>
        <div className="flex w-full border border-t-0 border-l-0 border-r-0 border-black"><span className="font-semibold w-52">Account</span>{wallet.accountId}</div>
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
      
        <Button onClick={handleConnect} disabled={false}>
          Connect IV Wallet
        </Button>
      </div>
    );
  }

  const errorDisplay = () => {
    if (error != null) {
      return (<div className="p-4 text-2xl font-bold text-red-200">{error}</div>);
    }

    return null;
  }

  const keysAssociatedDisplay = () => {
    if (keysAssociated != null) {
      if (keysAssociated) return (<div className="font-semibold text-green-400">😃 Yup</div>);
      return (<div className="font-semibold text-red-400">😅 Nope</div>)
    }

    return null;
  }

  const balances = () => {
    if (keysAssociated) {
      return (
        <>
        <Balances wallet={userWallet} />
        <Balances wallet={externalWallet} />
        </>
      );
    }

    return null;
  }

  const transferForm = () => {
    if (keysAssociated) {
      return (<span />);
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
        <Button
          onClick={handleVerifyKeys}
          disabled={userWallet.accountId == null || externalWallet.accountId == null}
        >
          Is Internal Key Associated With Both Accounts?
        </Button>
        { keysAssociatedDisplay() }
      </div>

      <div className="flex items-start justify-center w-full">
        { balances() }
      </div>

      <div className="flex items-start justify-center w-full">
        { transferForm() }
      </div>
    </div>
  );
}

export default Exchange;
