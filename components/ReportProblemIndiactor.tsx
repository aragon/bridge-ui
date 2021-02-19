import React, { useEffect, useState } from "react";
import { Box, GU, useTheme, Button } from "@aragon/ui";
import { PROBLEM_ICON } from "../lib/constants";
import { useSigner } from "@vocdoni/react-hooks";
import { useWallet } from "use-wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import networks from "@snapshot-labs/snapshot.js/src/networks.json";

import { HUB_URL } from "../lib/constants";

function ReportProblemIndicator() {
  const theme = useTheme();
  const signer = useSigner();
  const wallet = useWallet();

  // STATE & EFFECT ======================================================================

  const [signature, setSignature] = useState("");

  useEffect(() => {
    if (wallet?.account && wallet?.connectors?.injected) return;

    wallet.connect("injected");
  }, [wallet?.account]);

  async function getBlockNumber(provider) {
    try {
      const blockNumber: any = await provider.getBlockNumber();
      return parseInt(blockNumber);
    } catch (e) {
      return Promise.reject();
    }
  }

  // HELPERS =============================================================================

  const providers = {};

  //TODO make this work using the snapshot.js library
  function getProvider(network: string) {
    const url: string = networks[network].rpc[0];
    if (!providers[network]) providers[network] = new JsonRpcProvider(url);
    return providers[network];
  }

  const space = {
    name: "Aragon",
    network: "1",
    symbol: "ANT",
    skin: "aragon",
    domain: "gov.aragon.org",
    strategies: [
      {
        name: "erc20-balance-of",
        params: {
          address: "0xa117000000f279D81A1D3cc75430fAA017FA5A2e",
          symbol: "ANT",
          decimals: 18,
        },
      },
      {
        name: "balancer",
        params: {
          address: "0xa117000000f279D81A1D3cc75430fAA017FA5A2e",
          symbol: "ANT BPT",
        },
      },
    ],
    members: [
      "0xf08b64258465A9896691E23caaF9E6C830ec4b9D",
      "0x4cB3FD420555A09bA98845f0B816e45cFb230983",
      "0xa1d4c9e0a46068afa3d8424b0618218bf85ccaaa",
    ],
    filters: {
      defaultTab: "core",
      minScore: 0,
      onlyMembers: true,
      invalids: [
        "QmPNvdddbA1gQ8PCQxnEjhTeGSTvkdCarwkRyzgeoFHSgH",
        "QmNTgjdR3rNj25Ah6PxYzAzb8cD7cT6HmKoFFmKADrr2gC",
      ],
    },
  };

  async function createProblem() {
    const version = "0.1.3";
    const type = "proposal";
    const snapshot = await getBlockNumber(getProvider("5"));
    const payload = {
      name: "dfg",
      body: "dfg",
      choices: ["afga", "fdg"],
      start: 1614250800,
      end: 1614337200,
      snapshot: snapshot,
      metadata: {
        strategies: space.strategies,
      },
    };
    const envelope: any = {
      address: wallet.account,
      msg: JSON.stringify({
        version: version,
        timestamp: (Date.now() / 1e3).toFixed(),
        space: space.skin,
        type: type,
        payload,
      }),
    };

    envelope.sig = await signer.signMessage(envelope.msg);
    setSignature(envelope.sig);
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
  }

  // RENDERER ============================================================================

  return (
    <Box style={{ position: "fixed" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img style={{ display: "block" }} src={PROBLEM_ICON} alt="" />
        <h1
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            marginTop: `${1.5 * GU}px`,
            marginBottom: `${0.5 * GU}px`,
          }}
        >
          Report a Problem
        </h1>
        <p style={{ fontSize: "16px", marginBottom: `${2 * GU}px` }}>
          ... and get rewarded
        </p>
        <Button
          mode="negative"
          label="Create new problem"
          onClick={() => createProblem()}
        />
      </div>
      <div>
        <h2>Signer</h2>
        <p>
          The signer is{" "}
          {signer ? " ready" : " unavailable (Please, install MetaMask)"}
        </p>
        {signature ? <p>Signature: {signature}</p> : null}
      </div>
    </Box>
  );
}

export default ReportProblemIndicator;

const proposal = {
  address: "0x8367dc645e31321CeF3EeD91a10a5b7077e21f70",
  msg: {
    version: "0.1.3",
    timestamp: "1613659784",
    space: "aragon",
    type: "proposal",
    payload: {
      end: 1614250800,
      body: "Informative description.",
      name: "Cat or dog?",
      start: 1613646000,
      choices: ["cat", "not dog"],
      metadata: {
        strategies: [
          {
            name: "erc20-balance-of",
            params: {
              symbol: "ANT",
              address: "0xa117000000f279D81A1D3cc75430fAA017FA5A2e",
              decimals: 18,
            },
          },
          {
            name: "balancer",
            params: {
              symbol: "ANT BPT",
              address: "0xa117000000f279D81A1D3cc75430fAA017FA5A2e",
            },
          },
        ],
      },
      snapshot: 11881476,
    },
  },
  sig:
    "0x8f7be4a92c582b0d04026621f2aec7a556ff208879a3247f4156982b8189a49d25c752e21ca7d2e6f1d8530a86032e04244ed070d1fb46a773d78ac75efe97c71c",
  authorIpfsHash: "Qmf4cpNUBddvNLSMqg7JoCxdu54Zyf6bQxShKyHjj2Ra5V",
  relayerIpfsHash: "QmTjtp49bqd417LzqHUHFLLUsaYWJozhq3wmoQNNWuaWy5",
};
