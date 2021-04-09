import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { BalancesContext } from "../../pages/Exchange";

import Select from "react-select";
import Input from "./Input";

interface Props {
  id: string;
  onChangeAsset: Function;
  onChangeAmount: Function;
}

const AssetInput: React.FC<Props> = ({ id, onChangeAsset, onChangeAmount }: Props) => {
  const balances = useContext(BalancesContext);
  const [options, setOptions] = useState([] as { value: string; label: string}[]);

  useEffect(() => {
    const newOptions = balances.get(id)?.flatMap(asset => { return { value: asset.asset, label: asset.asset }});
    setOptions(newOptions ?? []);
  }, [balances])

  function handleChangeAsset(selected: { value: string; label: string } | null): void {
    onChangeAsset(selected?.value ?? null);
  }

  function handleChangeAmount(e: ChangeEvent<HTMLInputElement>): void {
    onChangeAmount(e.currentTarget.value);
  }
  
  return (
    <div className="flex flex-col items-center justify-center w-96">
      <Input
        name={`amount-${id}`}
        onChange={handleChangeAmount}
      />
      
      <Select
        className="w-60"
        options={options}
        onChange={handleChangeAsset}
      />
    </div>
  );
}

export default AssetInput;