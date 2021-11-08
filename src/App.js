import './App.css';
import { HomePage } from './app/containers/HomePage';
import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from 'ethers';
import { BrowserRouter as Router , Route, Switch} from 'react-router-dom';
import { SignIn } from './app/containers/SignIn';
import { Collection } from './app/containers/Collection';
import { MySellingNfts } from './app/containers/MySellingNfts';
import { Specials } from './app/containers/Specials';


export function getLibrary(provider) { 
  return  new ethers.providers.Web3Provider(window.ethereum); 
}

function App() {
  return (
    <Router>
      <div className="App">
        <Web3ReactProvider getLibrary={getLibrary}>
          <Switch>
            <Route exact path="/"> 
              <SignIn />
            </Route>
            <Route exact path="/Home"> 
              <HomePage />
            </Route>
            <Route exact path="/MyCollection"> 
              <Collection />
            </Route>
            <Route exact path="/MySellings"> 
              <MySellingNfts />
            </Route>
            <Route exact path="/Specials"> 
              <Specials />
            </Route>
          </Switch>
        </Web3ReactProvider>
      </div>
    </Router>
  );
      
}

export default App;
