import { Dispatch, SetStateAction } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";

interface ButtonProps {
  wallet: BeaconWallet | null;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  setWallet: Dispatch<SetStateAction<any>>;
  setBeaconConnection: Dispatch<SetStateAction<boolean>>;
}

const DisconnectButton = ({
  wallet,
  setPublicToken,
  setUserAddress,
  setUserBalance,
  setWallet,
  setBeaconConnection
}: ButtonProps): JSX.Element => {
  const disconnectWallet = async (): Promise<void> => {
    setUserAddress("");
    setUserBalance(0);
    setWallet(null);
    setBeaconConnection(false);
    setPublicToken(null);
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
