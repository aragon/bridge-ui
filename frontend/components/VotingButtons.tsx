import React, { useEffect } from "react";
import { GU, Link } from "@aragon/ui";
import { useSigner } from "@vocdoni/react-hooks";
import { useWallet } from "use-wallet";

import { DOWNARROW_ICON, TEST_HUB_URL, UPARROW_ICON } from "../lib/constants";

function VotingButtons({ proposal, no_upvotes, no_downvotes }) {
  const signer = useSigner();
  const wallet = useWallet();

  // STATE & EFFECT ======================================================================

  useEffect(() => {
    if (wallet?.account && wallet?.connectors?.injected) return;

    wallet.connect("injected");
  }, [wallet?.account]);

  // HELPERS =============================================================================

  //post vote message for particular problem/solution of particular project on snapshot
  async function vote(up: Boolean) {
    const version = "0.1.3";
    const type = "vote";
    const payload = {
      proposal: proposal,
      choice: up ? 1 : 2, //upvote indexed with 1, downvotes with 2
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
    const url = `${TEST_HUB_URL}/api/message`;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    // const mode: RequestMode = "cors";

    const init = {
      method: "POST",
      headers,
      // mode: mode,
      body: JSON.stringify(envelope),
    };

    fetch(url, init);
    //TODO handle errors
  }

  // RENDERER ============================================================================

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
