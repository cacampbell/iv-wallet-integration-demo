import React from 'react'
import Exchange from "./pages/Exchange";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import { Wallet } from './domain/wallet';

export const UserWalletContext = React.createContext({} as Wallet)

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <UserWalletContext.Provider value={{
            networkName: "Testnet",
            accountId: "0.0.6189",
            privateKey: "302e020100300506032b6570042204207f7ac6c8025a15ff1e07ef57c7295601379a4e9a526560790ae85252393868f0",
            publicKey: "302a300506032b6570032100480474335c38c27bfde1f0c2010d3db95eeb74a1f8ac65212f7824ce1ab84eca"
          }}>
            <Exchange/>
          </UserWalletContext.Provider>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
