import React from 'react'

import Button from "../components/Base/Button";

function handleConnect(): void {
  console.log("Handle Connect");
}

function Exchange() {
  return (
    <div className="h-screen p-12 font-sans tracking-wider bg-yellow-100">
      <div className="flex items-center">
        <Button onClick={handleConnect} width="200" height="50">
          Connect to External Wallet
        </Button>
      </div>
    </div>
  )
}

export default Exchange;
