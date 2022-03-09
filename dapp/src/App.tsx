import { useState } from 'react';
import './App.css';
import ConnectButton from './ConnectWallet';
import { TezosToolkit } from '@taquito/taquito';
import DisconnectButton from './DisconnectWallet';

function App() {

  const [Tezos, setTezos] = useState<TezosToolkit>(new TezosToolkit("https://hangzhounet.tezos.marigold.dev"));
  const [publicToken, setPublicToken] = useState<string | null>("");
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);

  return (
    <div className="App">
      <header className="App-header">
        <p>
        
        <ConnectButton
          Tezos={Tezos}
          setPublicToken={setPublicToken}
          setWallet={setWallet}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          setBeaconConnection={setBeaconConnection}
          wallet={wallet}
        />
        
        <DisconnectButton
          wallet={wallet}
          setPublicToken={setPublicToken}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          setWallet={setWallet}
          setBeaconConnection={setBeaconConnection}
        />

        <div>
        I am {userAddress} with {userBalance} Tz
        </div>

        </p>

      </header>
    </div>
  );
}

export default App;
