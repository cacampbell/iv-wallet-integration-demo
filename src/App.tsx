import React from 'react'
import Exchange from "./pages/Exchange";
import {BrowserRouter, Switch, Route} from "react-router-dom";

interface User {
  networkName?: string;
  accountId?: string;
  privateKey?: string;
}

export const UserContext = React.createContext({} as User)

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <UserContext.Provider value={{
            networkName: "testnet",
            accountId: "0.0.6189",
            privateKey: "302e020100300506032b6570042204207f7ac6c8025a15ff1e07ef57c7295601379a4e9a526560790ae85252393868f0"
          }}>
            <Exchange/>
          </UserContext.Provider>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
