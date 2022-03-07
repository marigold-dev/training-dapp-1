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

# :point_up:  Poke game

Goal of this training is to develop a poke game with smart contract. You will learn : 
- create a smart contract in jsligo
- inter smart-contract call
- deploy smart contract
- create a dapp using taquito and interact with browser wallet
- use an indexer

The game consists on poking the owner of a smart contract. We can also ask the smart contract to poke on-behalf of the user and get a feedback. The smartcontract keep a track of user interactions on the storage 

Poke sequence diagram
```sequence
Note left of User: Prepare normal poke
User->SM: poke owner
Note right of SM: store poke trace
SM->User: 
Note left of User: Prepare a 'jump' poke
User->SM: call poke other with feedback
SM->OtherSM: poke and get feedback
Note right of OtherSM: prepare a feedback to return
OtherSM->SM: return feedback
Note right of SM: store poke with feedback from other
SM->User: 
```

# :memo: Prerequisites


- [ ] [VS Code](https://code.visualstudio.com/download)
- [ ] [npm](https://nodejs.org/en/download/)
- [ ] [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [ ] [ligo](https://ligolang.org/docs/intro/installation/)

# :scroll: Smart contract

## Step 1 : create folder & file

```bash
mkdir smartcontract
touch ./smartcontract/pokeGame.jsligo
```

## Step 2 : edit pokeGame.jsligo

//TODO

## Step 3 : Try to poke

Compile :

```bash
ligo compile contract ./smartcontract/pokeGame.jsligo --output-file pokeGame.tz --entry-point main
```

Dry run : 

```bash
ligo run dry-run ./smartcontract/pokeGame.jsligo 'Poke()' '{  owner : ("tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk" as address), pokeTraces : (Map.empty as map<address, pokeMessage>) }' 
```

Output : 

```ocaml=
( LIST_EMPTY() ,
  record[owner -> @"tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk" ,
         pokeTraces -> MAP_ADD(@"tz1Pukg2LJyYn7Pk5VuQGXvWnZ12r7JTJGHK" ,
                               record[feedback -> "" ,
                                      receiver -> @"tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk"] ,
                               MAP_EMPTY())] )
```

## Step 4 : Deploy to testnet

//TODO


# :construction_worker:  Dapp 

## Step 1 : Create react app

```bash
yarn create react-app dapp --template typescript
```


---

## Step 2: ...

```typescript
var s = "JavaScript syntax highlighting";
alert(s);
```



