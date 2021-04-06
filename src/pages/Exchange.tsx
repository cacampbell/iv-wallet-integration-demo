import React, { useContext, useState } from "react";
// import { Client } from "@hashgraph/sdk";

import Button from "../components/Base/Button";
// import Input from "../components/Base/Input";
// import Loading from "../components/Base/Loading";

import { UserWalletContext, Wallet } from "../App";

function handleVerifyKeys(): void {
  console.log("Verify");
}

const Exchange: React.FC = () => {
  // Context Provider for User Information
  const userWallet = useContext(UserWalletContext);

  // State
  const [externalWallet, setExternalWallet] = useState({} as Wallet);
  const [busy, setBusy] = useState(false);

  // Handlers
  function handleConnect(): void {
    setBusy(true);
    
    // @ts-ignore
    if (window.wallet != null && userWallet.networkName != null) {
      // @ts-ignore
      setExternalWallet(window.wallet);
    }

    setBusy(false);
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
    
    return (
      <div className="flex flex-col items-start w-full h-full p-4 m-4 break-all bg-gray-200 justify-items-center">
        <div className="flex w-full border border-t-0 border-l-0 border-r-0 border-black"><span className="font-semibold w-52">Network</span>{wallet.networkName}</div>
        <div className="flex w-full border border-t-0 border-l-0 border-r-0 border-black"><span className="font-semibold w-52">Account</span>{wallet.accountId}</div>
        { privateKey() }
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
      <>
        <div className="p-2 text-xl font-semibold">
          Internal Wallet Information
        </div>
      
        {wallet()}
      </>
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
      <>
        <div className="p-2 text-xl font-semibold">
          External Wallet Information
        </div>
      
        {wallet()}
      
        <Button onClick={handleConnect}>
          Connect to IV Wallet
        </Button>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center p-10 justify-items-center w-96">
      {internalWalletDisplay()}
      
      {externalWalletDisplay()}
      
      <Button onClick={handleVerifyKeys}>
        Is Internal Key Associated With Both Accounts?
      </Button>
    </div>
  );
}

export default Exchange;
