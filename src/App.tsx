import React from 'react'
import Exchange from "./pages/Exchange";
import {BrowserRouter, Switch, Route} from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Exchange />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
