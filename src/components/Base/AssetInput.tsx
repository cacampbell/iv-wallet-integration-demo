import React, { useContext } from "react";
import { BalancesContext } from "../../pages/Exchange";

interface Props {
  id: string;
  onChangeAsset: Function;
  onChangeAmount: Function;
}

const AssetInput: React.FC<Props> = ({ id }: Props) => {
  const balances = useContext(BalancesContext);
  console.log(balances.get(id));
  return (<div>{id}</div>)
}

export default AssetInput;