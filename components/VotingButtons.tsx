import React, { useEffect, useState } from "react";
import { Button, useTheme, GU, Link } from "@aragon/ui";
import { useSigner } from "@vocdoni/react-hooks";
import { useRouter } from "next/router";
import { useWallet } from "use-wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import networks from "@snapshot-labs/snapshot.js/src/networks.json";

import { DOWNARROW_ICON, HUB_URL, UPARROW_ICON } from "../lib/constants";

function VotingButtons({ no_upvotes, no_downvotes }) {
  const router = useRouter();
  const signer = useSigner();
  const wallet = useWallet();

  // STATE & EFFECT ======================================================================

  // const [signature, setSignature] = useState("");

  useEffect(() => {
    if (wallet?.account && wallet?.connectors?.injected) return;

    wallet.connect("injected");
  }, [wallet?.account]);

  // HELPERS =============================================================================

  const providers = {};

  async function getBlockNumber(provider) {
    try {
      const blockNumber: any = await provider.getBlockNumber();
      return parseInt(blockNumber);
    } catch (e) {
      return Promise.reject();
    }
  }

  //TODO make this work using the snapshot.js library
  function getProvider(network: string) {
    const url: string = networks[network].rpc[0];
    if (!providers[network]) providers[network] = new JsonRpcProvider(url);
    return providers[network];
  }

  async function vote(up: Boolean) {
    const version = "0.1.3";
    const type = "vote";
    const payload = {
      proposal: "QmcPkyCFFKNpUDPdtLTvzHjsQa3z3uGCqdzqVdQj3LQhMD",
      choice: 1,
      metadata: {},
    };
    const envelope: any = {
      address: wallet.account,
      msg: JSON.stringify({
        version: version,
        timestamp: (Date.now() / 1e3).toFixed(),
        space: "aragon",
        type: type,
        payload,
      }),
    };

    envelope.sig = await signer.signMessage(envelope.msg);
    // setSignature(envelope.sig);
    const url = `${HUB_URL}/api/message`;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const mode: RequestMode = "cors";

    const init = {
      method: "POST",
      headers,
      mode: mode,
      body: JSON.stringify(envelope),
    };

    fetch(url, init);
    //TODO handle errors
  }

  const theme = useTheme();
  return (
    <section
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: `${2 * GU}px ${2 * GU}px ${2 * GU}px  ${3 * GU}px`,
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Link
          style={{ marginBottom: `${1 * GU}px`, marginRight: `${1 * GU}px` }}
          onClick={() => vote(true)}
        >
          <img src={UPARROW_ICON} alt="" width="64" height="64" />
        </Link>
        <p style={{ fontSize: "16px" }}>{no_upvotes}</p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Link
          style={{ marginBottom: `${1 * GU}px`, marginRight: `${1 * GU}px` }}
          onClick={() => vote(false)}
        >
          <img src={DOWNARROW_ICON} alt="" width="64" height="64" />
        </Link>
        <p style={{ fontSize: "16px" }}>{no_downvotes}</p>
      </div>
    </section>
  );
}

export default VotingButtons;
