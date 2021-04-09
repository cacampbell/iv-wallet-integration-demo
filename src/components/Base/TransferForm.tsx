import React, { useState } from "react";
import { Wallet } from "../../domain/wallet";
import { constructClient } from "../../service/hedera";
import AssetInput from "./AssetInput";
import Button from "./Button";

interface Props {
  label: string;
  sender: Wallet;
  recipient: Wallet;
  onTransfer?: Function;
}

const TransferForm: React.FC<Props> = ({
  label,
  sender,
  recipient,
  onTransfer
}: Props) => {
  // State
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [asset, setAsset] = useState("Hbar");
  const [amount, setAmount] = useState("0");
  
  async function handleTransfer(): Promise<void> {
    setError("");
    setSuccess("");
    
    if (asset === "" || amount === "") {
      setError("Please select an asset and enter an amount.");
      return;
    }

    try {
      setBusy(true);
      
      const {
        TokenId,
        Hbar,
        TransferTransaction,
        TokenAssociateTransaction
      } = await import("@hashgraph/sdk");
      
      const client = await constructClient(sender);
      if (client == null) {
        throw new Error(`Could not construct client for ${sender.accountId.toString()}`);
      }
      
      if (asset === "Hbar") {
        const hbar = new Hbar(parseInt(amount));

        // Transfer Hbar
        const transfer = new TransferTransaction()
          .setMaxTransactionFee(new Hbar(1))
          .setTransactionMemo(`${label}`)
          .addHbarTransfer(sender.accountId, hbar.negated())
          .addHbarTransfer(recipient.accountId, hbar);

        // Get Receipt
        const receipt = await (
          await transfer.execute(client)
        ).getReceipt(client);

        setSuccess(`${receipt.status}`);
      } else {
        const token = TokenId.fromString(asset);
        const count = parseInt(amount);

        // Associate Token
        try {        
          const associate = new TokenAssociateTransaction()
            .setAccountId(recipient.accountId)
            .setTokenIds([token])
            .setMaxTransactionFee(new Hbar(1));
          await (await associate.execute(client)).getReceipt(client);
        } catch (error) {
          // Continue if Already Associated
          if (!error.message.includes("TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT")) {
            throw error;
          }
        }
        
        // Token Transfer
        const transfer = new TransferTransaction()
          .setMaxTransactionFee(new Hbar(1))
          .setTransactionMemo(`${label}`)
          .addTokenTransfer(token, sender.accountId, -count)
          .addTokenTransfer(token, recipient.accountId, count);

        // Get Receipt
        const receipt = await (
          await transfer.execute(client)
        ).getReceipt(client);

        setSuccess(`${receipt.status}`);

        // If Transfer Callback, Call it
        if (onTransfer != null) onTransfer()
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-2 text-xl font-semibold">
        {label} Assets
      </div>
        
      <AssetInput
        id={sender.accountId.toString()}
        onChangeAsset={setAsset}
        onChangeAmount={setAmount}
      />

      <div className="p-2" />
        
      <Button 
        disabled={busy} 
        onClick={handleTransfer}
      >
        {label}
      </Button>

      { error.length > 0 ? (
        <div className="flex items-center justify-center pt-4 text-sm italic font-semibold w-96">
          <span className="text-red-400">{error}</span>
        </div>
      ) : null }

      { success.length > 0 ? (
        <div className="flex items-center justify-center pt-4 text-sm italic font-semibold w-96">
          <span className="text-green-400">{success}</span>
        </div>
      ) : null }
    </div>
  );
}

export default TransferForm;