import React from 'react'
import Exchange from "./pages/Exchange";
import {BrowserRouter, Switch, Route} from "react-router-dom";

export interface Wallet {
  networkName: string;
  accountId: string;
  privateKey?: string;
  signer?: Function;
}

export const UserWalletContext = React.createContext({} as Wallet)

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <UserWalletContext.Provider value={{
            networkName: "testnet",
            accountId: "0.0.6189",
            privateKey: "302e020100300506032b6570042204207f7ac6c8025a15ff1e07ef57c7295601379a4e9a526560790ae85252393868f0"
          }}>
            <Exchange/>
          </UserWalletContext.Provider>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
