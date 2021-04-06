import React from "react";
// import { Client } from "@hashgraph/sdk";

import Button from "../components/Base/Button";
// import Input from "../components/Base/Input";

const networkName = "Testnet"; // "Mainnet"
// const internalAccount = "0.0.6189"; // Get from Backend
// const internalKey = "302e020100300506032b6570042204207f7ac6c8025a15ff1e07ef57c7295601379a4e9a526560790ae85252393868f0"; // Get this or signer from Backend

let ivWallet: unknown;
let ivAccount: unknown;

async function handleConnect(): Promise<void> {
  // @ts-ignore
  if (window.wallet != null) {
    // @ts-ignore
    ivWallet = window.wallet;
  }

  // @ts-ignore
  ivAccount = await ivWallet.login(networkName);
}

function handleVerifyKeys(): void {
  console.log(ivWallet);
  console.log(ivAccount);
}

function Exchange() {
  return (
    <div className="w-screen h-screen p-20">
      <div className="flex items-center justify-center">
        <Button onClick={handleConnect} width="200" height="50">
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
