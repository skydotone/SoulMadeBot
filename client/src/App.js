import React, { useState, useEffect } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl';
import config from '../../config.json';

fcl.config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');

function App() {
  const [user, setUser] = useState({});

  const getBalance = async () => {
    const response = await fetch('/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, memberID: config.myMemberID }),
    });
  }

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, [])

  useEffect(() => {
    if (user && user.addr) {
      getBalance();
    }
  }, [user, getBalance]);

  const authentication = async () => {
    if (user.addr) {
      fcl.unauthenticate();
    } else {
      fcl.authenticate();
    }
  }

  return (
    <div className="App">
      <h1>{user && user.addr ? "Please close this browser." : null}</h1>
      <button className="button-9" onClick={() => authentication()}>{!user.addr ? "Log in with Blocto" : "Log out"}</button>
    </div>
  );
}

export default App;
