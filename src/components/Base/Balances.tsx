import React, { useEffect, useState } from "react";
import Long from "long";
import { Wallet } from "../../domain/wallet";
import { getHbarBalance, getTokenBalances } from "../../service/hedera";

interface Props {
  wallet: Wallet;
}

const Balances: React.FC<Props> = ({ wallet }: Props) => {
  const [assets, setAssets] = useState({} as Map<string, Long>);
  
  async function refreshBalances() {
    const newAssets = new Map<string, Long>();
    const balance = await getHbarBalance(wallet);
    const tokens = await getTokenBalances(wallet);
    newAssets.set("Hbar", balance?.toTinybars()!)
    for (const token of tokens!) {
      newAssets.set(token.id.toString(), token.balance);
    }
    setAssets(assets);
  }

  useEffect(() => {refreshBalances()});

  return (<div>{JSON.stringify(assets)}</div>);
}

export default Balances;