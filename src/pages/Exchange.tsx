import React, { useContext } from "react";
// import { Client } from "@hashgraph/sdk";

import Button from "../components/Base/Button";
// import Input from "../components/Base/Input";

import { UserContext } from "../App";

let ivWallet: unknown;
let ivAccount: unknown;

async function handleConnect(networkName: string | undefined): Promise<void> {
  // @ts-ignore
  if (window.wallet != null && networkName != null) {
    // @ts-ignore
    ivWallet = window.wallet;

    // @ts-ignore
    ivAccount = await ivWallet.login(networkName);
  }
}

function handleVerifyKeys(): void {
  console.log(ivWallet);
  console.log(ivAccount);
}

function Exchange() {
  // Get App User Information (defined in App)
  const user = useContext(UserContext);
  console.log(user);
  
  return (
    <div className="w-screen h-screen p-20">
      <div className="flex items-center justify-center">
        <Button onClick={() => handleConnect(user.networkName)} width="200" height="50">
          Connect to IV Wallet
        </Button>
        <Button onClick={handleVerifyKeys} width="200" height="50">
          Is Internal Key Associated With Both Accounts?
        </Button>
      </div>
    </div>
  )
}

export default Exchange;
