import React, { useState } from "react";
import Long from "long";
import { Wallet } from "../../domain/wallet";
import { getHbarBalance, getTokenBalances } from "../../service/hedera";
import Button from "./Button";
import Loading from "./Loading";

interface Props {
  wallet: Wallet;
}

const Balances: React.FC<Props> = ({ wallet }: Props) => {
  const [assets, setAssets] = useState([] as { asset: string; balance: Long | string }[]);
  const [busy, setBusy] = useState(false);
  
  async function refreshBalances() {
    setBusy(true);
    const newAssets = []
    const balance = await getHbarBalance(wallet);
    const tokens = await getTokenBalances(wallet);
    
    // Hbar balance
    newAssets.push({
      asset: "Hbar",
      balance: balance?.toString() ?? ""
    });
    
    // Token Balances
    for (const token of tokens!) {
      newAssets.push({
        asset: token.id.toString(),
        balance: token.balance
      });
    }
    
    setAssets([...new Set(newAssets)]);
    setBusy(false);
  }

  const assetRowsDisplay = () => {
    if (busy) {
      return (<Loading />);
    }

    const rows = [];
    for (const asset of assets) {
      rows.push(
        <div key={asset.asset} className="flex items-center justify-between w-full px-4 py-1">
          <div className="text-sm font-semibold">{asset.asset}</div>

          <div className="text-sm italic">{asset.balance.toString()}</div>
        </div>);
    }

    return rows;
  }

  return (
  <div className="flex flex-col items-center justify-start bg-gray-200 w-96">
    <div className="w-full px-4">
      <div className="flex items-center justify-between py-2 mb-1 text-lg font-semibold border border-t-0 border-l-0 border-r-0 border-black">
        {`${wallet.accountId.toString()} Assets`}
        
        <Button onClick={refreshBalances} disabled={busy}>Refresh</Button>
      </div>
    </div>

    <div className="flex flex-col items-center justify-between w-full overflow-y-scroll max-h-96">
      { assetRowsDisplay() }
    </div>
  </div>
  );
}

export default Balances;