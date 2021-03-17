import React from "react";
import { Button, Split, IconEthereum, GU } from "@aragon/ui";
import { useRouter } from "next/router";

import Title from "../components/Title";
import "../styles/index.less";
import { ChainUnsupportedError, useWallet } from "use-wallet";
import { INVALID_CHAIN_ID, METAMASK_IS_NOT_AVAILABLE } from "../lib/errors";

const WelcomePage = ({ connectionSetter, addressSetter }) => {
  const router = useRouter();
  const wallet = useWallet();
  // const [connecting, setConnecting] = useState(false) //TODO find out what this did.
  const isConnected = wallet.status === "connected";
  connectionSetter(isConnected);
  addressSetter(wallet.account);

  // CALLBACK
  function onWalletConnect() {
    if (wallet.status === "connected") {
      connectionSetter(true);
      addressSetter(wallet.account);
      let urlObject = {
        pathname: `/[project]/problems`,
        query: { project: "aragon" },
      };
      router.push(urlObject);
    }

    // setConnecting(true);
    return wallet
      .connect("injected")
      .then(() => {
        if (!wallet.connectors.injected)
          throw new Error(METAMASK_IS_NOT_AVAILABLE);
        let urlObject = {
          pathname: `/[project]/problems`,
          query: { project: "aragon" },
        };
        router.push(urlObject);
      })
      .catch((err) => {
        // setConnecting(false);
        if (
          (err && err.message == INVALID_CHAIN_ID) ||
          err instanceof ChainUnsupportedError
        ) {
          const msg = "Please, switch to the {{NAME}} network".replace(
            "{{NAME}}",
            process.env.ETH_NETWORK_ID
          );
          return alert(msg);
        } else if (err && err.message == METAMASK_IS_NOT_AVAILABLE) {
          return alert("Please, install Metamask or a Web3 compatible wallet");
        }
        console.error(err);
        alert("Could not access Metamask or connect to the network");
      });
  }

  return (
    <div style={{ height: `${100 * GU}px` }}>
      <Split
        primary={
          <Title
            title="Welcome"
            subtitle="Please connect your wallet in order to proceed."
          />
        }
        secondary={
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: `${10 * GU}px ${2 * GU}px ${7 * GU}px`,
            }}
          >
            <Button
              label={isConnected ? "Show Problems" : "Connect with MetaMask"}
              icon={<IconEthereum />}
              mode="strong"
              style={{ background: "#59A0FF" }}
              wide
              onClick={() => onWalletConnect()}
            />
          </div>
        }
      />
    </div>
  );
};

export default WelcomePage;
