import React, { useContext } from "react";
import { BalancesContext } from "../../pages/Exchange";

interface Props {
  id: string;
}

const Balances: React.FC<Props> = ({ id }: Props) => {
  const assets = useContext(BalancesContext)

  const assetRowsDisplay = () => {
    const rows = [];
    const matchingAssets = assets.get(id);
    
    if (matchingAssets != null) {
      for (const asset of matchingAssets) {
        rows.push(
          <div key={asset.asset} className="flex items-center justify-between w-full px-4 py-1">
            <div className="text-sm font-semibold">{asset.asset}</div>

            <div className="text-sm italic">{asset.balance.toString()}</div>
          </div>);
      }

      return rows;
    }

  return null;
  }

  return (
  <div className="flex flex-col items-center justify-start bg-gray-200 w-96">
    <div className="w-full px-4">
      <div className="flex items-center justify-between py-2 mb-1 text-lg font-semibold border border-t-0 border-l-0 border-r-0 border-black">
        {`${id} Assets`}
      </div>
    </div>

    <div className="flex flex-col items-center justify-between w-full overflow-y-scroll max-h-96">
      { assetRowsDisplay() }
    </div>
  </div>
  );
}

export default Balances;