---
title: Training dapp n°1
tags: Training
description: Training n°1 for decentralized application
---

Training dapp n°1
===

[ToC]

:::info
:bulb: **Github repository :** get the complete solution [here](https://github.com/marigold-dev/training-dapp-1.git)
:::
:::info
:bulb: **Hackmd original page** [here](https://hackmd.io/sJ2WKZlIRvO58w-YV1jf9A?view)
:::

# :point_up:  Poke game

> dapp : A decentralized application (dApp) is a type of distributed open source software application that runs on a peer-to-peer (P2P) blockchain network rather than on a single computer. DApps are visibly similar to other software applications that are supported on a website or mobile device but are P2P supported

Goal of this training is to develop a poke game with smart contract. You will learn : 
- create a smart contract in jsligo
- deploy smart contract
- create a dapp using taquito and interact with browser wallet
- use an indexer

> :warning: This is not an HTML or REACT training, I will avoid asmuch of possible any complexity relative to these technologies 

The game consists on poking the owner of a smart contract.  The smartcontract keeps a track of user interactions on the storage 

Poke sequence diagram
```sequence
Note left of User: Prepare poke
User->SM: poke owner
Note right of SM: store poke trace
SM->User: 
```

# :memo: Prerequisites

Please install this software first : 

- [ ] [VS Code](https://code.visualstudio.com/download) : as text editor
- [ ] [npm](https://nodejs.org/en/download/) : we will use a typescript React client app
- [ ] [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) : because yet another
- [ ] [ligo](https://ligolang.org/docs/intro/installation/) : high level language that's transpile to michelson low level language and provide lot of development support for Tezos
- [ ] [tezos-client (method 1)](https://tezos.gitlab.io/introduction/howtoget.html) or [tezos-client (method 2)](https://assets.tqtezos.com/docs/setup/1-tezos-client/#install) : the Tezos CLI
- [ ] [Temple wallet](https://templewallet.com/) : an easy to use Tezos wallet as browser plugin 

# :scroll: Smart contract

## Step 1 : Create folder & file

```bash
mkdir smartcontract
touch ./smartcontract/pokeGame.jsligo
```

## Step 2 : Edit pokeGame.jsligo

Add a main function

```javascript=
type storage = unit;

type parameter =
| ["Poke"];

type return_ = [list<operation>, storage];

let main = ([action, store] : [parameter, storage]) : return_ => {
    return match (action, {
        Poke: () => poke(store)
    } 
    )
};
```

Every contract requires :
- an entrypoint, **main** by default, with a mandatory signature taking 2 parameters and a return : 
    - **parameter** : the contract `parameter`
    - **storage** : the on-chain storage (can be any type, here `unit` by default)
    - **return_** : a list of `operation` and a storage

> Doc :  https://ligolang.org/docs/advanced/entrypoints-contracts

>:warning: You will notice that jsligo is a javascript-like language, multiple parameter declaration is a bit different.
Instead of this declaration : `(action : parameter, store : storage)`
You have to separate variable name to its type declaration this way : `([action, store] : [parameter, storage])`


Pattern matching is an important feature in Ligo. We need a switch on the entrypoint function to manage different actions. We use `match` to evaluate the parameter and call the appropriated `poke` function
> Doc https://ligolang.org/docs/language-basics/unit-option-pattern-matching

```javascript
match (action, {
        Poke: () => poke(store)
    } 
```

`Poke` is a `parameter` from `variant` type. It is the equivalent of Enum type in javascript

```javascript
type parameter =
| ["Poke"];
```

> Doc https://ligolang.org/docs/language-basics/unit-option-pattern-matching#variant-types

## Step 3 : Write the poke function

We want to store every caller address poking the contract. Let's redefine storage, and then add the caller to the set of poke guys

```javascript
type storage = set<address>;

let poke = (store : storage) : return_ => {
    return [  list([]) as list<operation>, Set.add(Tezos.source, store)]; 
};
```

Set library has specific usage :
> Doc https://ligolang.org/docs/language-basics/sets-lists-tuples#sets


Here, we get the caller address using `Tezos.source`. Tezos library provides useful function for manipulating blockchain objects
> Doc https://ligolang.org/docs/reference/current-reference

## Step 4 : Try to poke

The LIGO command-line interpreter provides sub-commands to directly test your LIGO code

> Doc : https://ligolang.org/docs/advanced/testing

Compile contract (to check any error, and prepare the michelson outputfile to deploy later) :

```bash
ligo compile contract ./smartcontract/pokeGame.jsligo --output-file pokeGame.tz
```

Compile an initial storage (to pass later during deployment too)

```
ligo compile storage ./smartcontract/pokeGame.jsligo 'Set.empty as set<address>' --output-file pokeGameStorage.tz --entry-point main
```

Dry run (i.e test an execution locally without deploying), pass the contract parameter `Poke()` and the initial on-chain storage with an empty set : 

```bash
ligo run dry-run ./smartcontract/pokeGame.jsligo 'Poke()' 'Set.empty as set<address>' 
```

Output should give : 

```ocaml=
( LIST_EMPTY() ,
  SET_ADD(@"tz1QL8xpMA9JwtUYXXwB6qnJTk8pkEakHpT4" , SET_EMPTY()) )
```

You can notice that the instruction will store the address of the caller into the traces storage

## Step 5 : Configure your testnet local environment

Choose a testnet to deploy

For hangzhounet :
```
tezos-client --endpoint https://hangzhounet.tezos.marigold.dev config update
```

You will need an implicit account on your local wallet and get free Tz from a [faucet] and download the .json file locally (https://teztnets.xyz/)

> Doc : https://tezos.gitlab.io/introduction/howtouse.html#get-free-tez

Replace <ACCOUNT_KEY_NAME> by account key of your choice : 

```
tezos-client activate account <ACCOUNT_KEY_NAME> with "tz1__xxxxxxxxx__.json"
```

List all local accounts :

```
tezos-client list known addresses
```

Your account should appear on the list now

Check your balance

```
tezos-client get balance for <ACCOUNT_KEY_NAME>
```

:rocket: You are ready to go :sunglasses: 

## Step 6 : Deploy to testnet

Use the tezos-client to deploy the contract

```
tezos-client originate contract mycontract transferring 0 from <ACCOUNT_KEY_NAME> running pokeGame.tz --init "$(cat pokeGameStorage.tz)" --burn-cap 1
```

Verify the output. a successful output display the address of the new created smart contract on the testnet

```
New contract KT1M1sXXUYdLvow9J4tYcDDrYa6aKn3k1NT9 originated.
```

Interact now with it, poke it ! :face_with_hand_over_mouth: 

```
tezos-client transfer 0 from <ACCOUNT_KEY_NAME> to mycontract --burn-cap 0.01 
```

Check that your address is registered on the storage

```
tezos-client get contract storage for mycontract 
```

HOORAY :confetti_ball: your smart contract is ready !





# :construction_worker:  Dapp 

## Step 1 : Create react app

```bash
yarn create react-app dapp --template typescript

cd dapp
```

Add taquito, tzkt indexer lib

```
yarn add @taquito/taquito @taquito/beacon-wallet
yarn add @dipdup/tzkt-api
```

> :warning: If you are using last version 5.x of react-script, follow these steps to rewire webpack for all encountered missing libraries : https://github.com/ChainSafe/web3.js#troubleshooting-and-known-issues


Start the dev server

```
yarn run start
```

Open your browser at : http://localhost:3000/
Your app should be running

## Step 2 : Connect / disconnect the wallet

We will declare 2 React Button components and a display of address and balance while connected

Edit src/App.tsx file

```typescript
import { useState } from 'react';
import './App.css';
import ConnectButton from './ConnectWallet';
import { TezosToolkit } from '@taquito/taquito';
import DisconnectButton from './DisconnectWallet';

function App() {

  const [Tezos, setTezos] = useState<TezosToolkit>(new TezosToolkit("https://hangzhounet.tezos.marigold.dev"));
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);

  return (
    <div className="App">
      <header className="App-header">
        <p>
        
        <ConnectButton
          Tezos={Tezos}
          setWallet={setWallet}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          wallet={wallet}
        />
        
        <DisconnectButton
          wallet={wallet}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          setWallet={setWallet}
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
```

Let's create the 2 missing src component files and put code in it

```
touch ConnectWallet.tsx
touch DisconnectWallet.tsx
```

ConnectWallet button will create an instance wallet, get user permissions via a popup and then retrieve account information

Edit ConnectWallet.tsx

```typescript
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType
} from "@airgap/beacon-sdk";

type ButtonProps = {
  Tezos: TezosToolkit;
  setWallet: Dispatch<SetStateAction<any>>;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  wallet: BeaconWallet;
};

const ConnectButton = ({
  Tezos,
  setWallet,
  setUserAddress,
  setUserBalance,
  wallet
}: ButtonProps): JSX.Element => {

  const setup = async (userAddress: string): Promise<void> => {
    setUserAddress(userAddress);
    // updates balance
    const balance = await Tezos.tz.getBalance(userAddress);
    setUserBalance(balance.toNumber());
  };

  const connectWallet = async (): Promise<void> => {
    try {
      if(!wallet) await createWallet();
      await wallet.requestPermissions({
        network: {
          type: NetworkType.HANGZHOUNET,
          rpcUrl: "https://hangzhounet.tezos.marigold.dev"
        }
      });
      // gets user's address
      const userAddress = await wallet.getPKH();
      await setup(userAddress);
    } catch (error) {
      console.log(error);
    }
  };

  const createWallet = async() => {
    // creates a wallet instance if not exists
    if(!wallet){
      wallet = new BeaconWallet({
      name: "training",
      preferredNetwork: NetworkType.HANGZHOUNET
    });}
    Tezos.setWalletProvider(wallet);
    setWallet(wallet);
    // checks if wallet was connected before
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      const userAddress = await wallet.getPKH();
      await setup(userAddress);
    }
  }

  useEffect(() => {
    (async () => createWallet())();
  }, []);

  return (
    <div className="buttons">
      <button className="button" onClick={connectWallet}>
        <span>
          <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
        </span>
      </button>
    </div>
  );
};

export default ConnectButton;
```

DisconnectWallet button will clean wallet instance and all linked objects

```typescript
import { Dispatch, SetStateAction } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";

interface ButtonProps {
  wallet: BeaconWallet | null;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  setWallet: Dispatch<SetStateAction<any>>;
}

const DisconnectButton = ({
  wallet,
  setUserAddress,
  setUserBalance,
  setWallet,
}: ButtonProps): JSX.Element => {
  const disconnectWallet = async (): Promise<void> => {
    setUserAddress("");
    setUserBalance(0);
    setWallet(null);
    console.log("disconnecting wallet");
    if (wallet) {
      await wallet.client.removeAllAccounts();
      await wallet.client.removeAllPeers();
      await wallet.client.destroy();
    }
  };

  return (
    <div className="buttons">
      <button className="button" onClick={disconnectWallet}>
        <i className="fas fa-times"></i>&nbsp; Disconnect wallet
      </button>
    </div>
  );
};

export default DisconnectButton;

```

Save both file, the dev server should refresh the page

![](https://hackmd.io/_uploads/ryAnV4Pbq.png)

> Note on Temple wallet configuration :
> Go to your browser plugin and import an account 
> ![](https://hackmd.io/_uploads/ByVDnFnb5.png)
> Choose the private key, copy/paste that is located here : ~/.tezos-client/secret_keys 
> ![](https://hackmd.io/_uploads/Byv33Y3b5.png)



Once Temple is configured well, Click on Connect button

On the popup, select your Temple wallet, then your account and connect. :warning: Do not forget to stay on the "Hangzhounet" testnet

![](https://hackmd.io/_uploads/ryn-HVw-9.png)

:confetti_ball: your are *"logged"*

Click on the Disconnect button to logout to test it

## Step 3 : List poke contracts via an indexer

Remember that you deployed your contract previously.
Instead of querying heavily the rpc node to search where is located your contract and get back some information about it, we can use an indexer. We can consider it as an enriched cache API on top of rpc node. In this example, we will use the tzkt indexer

Add the library

```
yarn add @dipdup/tzkt-api
```

We will add a button to fetch all similar contracts to the one you deployed, then we display the list

Now, edit App.tsx to add 1 import on top of the file

```typescript
import { Contract, ContractsService } from '@dipdup/tzkt-api';
```

Before the return , add this section for the fetch

```typescript
  const contractsService = new ContractsService( {baseUrl: "https://api.hangzhounet.tzkt.io" , version : "", withCredentials : false});
  const [contracts, setContracts] = useState<Array<Contract>>([]);

  const fetchContracts = () => {
    (async () => {
     setContracts((await contractsService.getSimilar({address:"KT1M1sXXUYdLvow9J4tYcDDrYa6aKn3k1NT9" , includeStorage:true, sort:{desc:"id"}})));
    })();
  }
```

On the return 'html templating' section, add this after the display of the user balance div, add this : 

```html
<br />
<div>
    <button onClick={fetchContracts}>Fetch contracts</button>
    {contracts.map((contract) => <div>{contract.address}</div>)}
</div>
```
Save your file and go to the browser. click on Fetch button

![](https://hackmd.io/_uploads/H1oU34Pbc.png)

:confetti_ball:  Congrats ! you are able to list all similar deployed contracts


## Step 4 : Poke your contract

Add some import at the top

```typescript
import { TezosToolkit, WalletContract } from '@taquito/taquito';
```

Add this new function inside the App function, it will call the entrypoint to poke

```typescript
  const poke = async (contract : Contract) => {   
    let c : WalletContract = await Tezos.wallet.at(""+contract.address);
    try {
      const op = await c.methods.default().send();
      await op.confirmation();
    } catch (error : any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
    }
  };
```

> :warning: Normally we should call `c.methods.poke()` function , but there is a bug while compiling ligo variant with one unique choice, then the `default` is generated instead of having the name of the function. Also be careful because all entrypoints naming are converting to lowercase whatever variant variable name you can have on source file. 

Then replace the line displaying the contract address by this one that will add a Poke button

```html
    {contracts.map((contract) => <div>{contract.address} <button onClick={() =>poke(contract)}>Poke</button></div>)}
```

Save and see the page refreshed, then click on Poke button

![](https://hackmd.io/_uploads/ryk3qSv-5.png)

:confetti_ball:  If you have enough Tz on your wallet for the gas, then it should have successfully call the contract and added you to the list of poke guyz

## Step 5 : Display poke guys

To verify that on the page, we can display the list of poke guyz directly on the page

Replace again the html contracts line by this one

```html
<table><thead><tr><th>address</th><th>people</th><th>action</th></tr></thead><tbody>
    {contracts.map((contract) => <tr><td style={{borderStyle: "dotted"}}>{contract.address}</td><td style={{borderStyle: "dotted"}}>{contract.storage.join(", ")}</td><td style={{borderStyle: "dotted"}}><button onClick={() =>poke(contract)}>Poke</button></td></tr>)}
    </tbody></table>
```

Contracts are displaying its people now 

![](https://hackmd.io/_uploads/HywGr92b9.png)

> :information_source: Wait around few second for blockchain confirmation and click on "fetch contracts" to refresh the list
 
:confetti_ball: Congratulation, you have completed this first dapp training 

# :beach_with_umbrella: Conclusion

Now, you are able to create any Smart Contract using Ligo and build a Dapp via Taquito to interact with it

On next training, you will learn how to call a Smart contract inside a Smart Contract and use the callback, write unit test, etc ...

[:arrow_right: NEXT](https://hackmd.io/8N_Efu5VQWiVbehy9H18Xw)


