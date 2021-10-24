import './App.css';
import { HomePage } from './app/containers/HomePage';
import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from 'ethers';
import { BrowserRouter as Router , Route, Switch} from 'react-router-dom';
import { SignIn } from './app/containers/SignIn';
import { Services } from './app/containers/Admin';

export function getLibrary(provider) { 
  return  new ethers.providers.Web3Provider(window.ethereum); 
}

function App() {
  return (
    <Router>
      <div className="App">
        <Web3ReactProvider getLibrary={getLibrary}>
          <Switch>
            <Route path="/Home"> 
              <HomePage />
            </Route>
            <Route exact path="/"> 
              <SignIn />
            </Route>
            <Route exact path="/Admin"> 
              <Services />
            </Route>
          </Switch>
        </Web3ReactProvider>
      </div>
    </Router>
  );
      
}

export default App;
