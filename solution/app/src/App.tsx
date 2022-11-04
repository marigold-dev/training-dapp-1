import { NetworkType } from "@airgap/beacon-types";
import { Contract, ContractsService } from "@dipdup/tzkt-api";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { useEffect, useState } from "react";
import "./App.css";
import ConnectButton from "./ConnectWallet";
import DisconnectButton from "./DisconnectWallet";
import { PokeGameWalletType } from "./pokeGame.types";

function App() {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.tezos.marigold.dev")
  );
  const [wallet, setWallet] = useState<BeaconWallet>(
    new BeaconWallet({
      name: "Training",
      preferredNetwork: NetworkType.GHOSTNET,
    })
  );

  useEffect(() => {
    Tezos.setWalletProvider(wallet);
  }, [wallet]);

  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);

  const contractsService = new ContractsService({
    baseUrl: "https://api.ghostnet.tzkt.io",
    version: "",
    withCredentials: false,
  });
  const [contracts, setContracts] = useState<Array<Contract>>([]);

  const fetchContracts = () => {
    (async () => {
      setContracts(
        await contractsService.getSimilar({
          address: process.env["REACT_APP_CONTRACT_ADDRESS"]!,
          includeStorage: true,
          sort: { desc: "id" },
        })
      );
    })();
  };

  const poke = async (contract: Contract) => {
    let c: PokeGameWalletType = await Tezos.wallet.at<PokeGameWalletType>(
      "" + contract.address
    );
    try {
      const op = await c.methods.default().send();
      await op.confirmation();
      alert("Tx done");
    } catch (error: any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <ConnectButton
          Tezos={Tezos}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          wallet={wallet}
        />

        <DisconnectButton
          wallet={wallet}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
        />

        <div>
          I am {userAddress} with {userBalance} mutez
        </div>

        <br />
        <div>
          <button onClick={fetchContracts}>Fetch contracts</button>
          <table>
            <thead>
              <tr>
                <th>address</th>
                <th>people</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr>
                  <td style={{ borderStyle: "dotted" }}>{contract.address}</td>
                  <td style={{ borderStyle: "dotted" }}>
                    {contract.storage.join(", ")}
                  </td>
                  <td style={{ borderStyle: "dotted" }}>
                    <button onClick={() => poke(contract)}>Poke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
