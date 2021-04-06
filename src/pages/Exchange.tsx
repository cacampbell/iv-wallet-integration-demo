import React, { useContext, useState } from "react";
// import { Client } from "@hashgraph/sdk";

import Button from "../components/Base/Button";
// import Input from "../components/Base/Input";

import { UserContext } from "../App";

function handleVerifyKeys(): void {
  console.log("Verify");
}

const Exchange: React.FC = () => {
  // Get App User Information (defined in App)
  const user = useContext(UserContext);

  // Reactive container for iv wallet information
  const [externalWallet, setExternalWallet] = useState({} as unknown);

  async function handleConnect(): Promise<void> {
    // @ts-ignore
    if (window.wallet != null && user.networkName != null) {
      // @ts-ignore
      setExternalWallet(window.wallet);
    }
  }

  const externalWalletDisplay = () => {
    // @ts-ignore
    if (externalWallet.account != null) { 
      return (<div>{JSON.stringify(externalWallet)}</div>);
    }

    return null;
  }

  return (
    <div className="flex flex-col">
      <Button onClick={handleConnect}>
        Connect to IV Wallet
      </Button>

      { externalWalletDisplay() }
  
      <Button onClick={handleVerifyKeys}>
        Is Internal Key Associated With Both Accounts?
      </Button>
    </div>
  );
}

export default Exchange;
