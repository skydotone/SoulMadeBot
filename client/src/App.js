import React, { useState, useEffect } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl';

fcl.config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');

function App(props) {
  const [user, setUser] = useState();

  const getBalance = async () => {
    // Gets the id in the URL
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let id = params.get('id');

    const response = await fetch('/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, uuid: id }),
    });
  }

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, [])

  useEffect(() => {
    if (user && user.addr) {
      getBalance();
    }
  }, [user]);

  const authentication = async () => {
    if (user.addr) {
      fcl.unauthenticate();
    } else {
      fcl.authenticate();
    }
  }

  return (
    <div className="App">
      <h1>{user && user.addr ? "You can close your browser now." : null}</h1>
      <button className="button-9" onClick={() => authentication()}>{user && !user.addr ? "Log in with Blocto" : "Log out"}</button>
    </div>
  );
}

export default App;
