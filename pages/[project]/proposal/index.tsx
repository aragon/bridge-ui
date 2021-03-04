import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSigner } from "@vocdoni/react-hooks";
import { useWallet } from "use-wallet";
import { GU, Button, Field, TextInput, DateRangePicker } from "@aragon/ui";
import { JsonRpcProvider } from "@ethersproject/providers";
import networks from "@snapshot-labs/snapshot.js/src/networks.json";

import { HUB_URL } from "../../../lib/constants";
import Title from "../../../components/Title";
import "../../../styles/index.less";
import Breadcrumbs from "../../../components/Breadcrumb";

const ProposalForm = () => {
  const signer = useSigner();
  const wallet = useWallet();
  const router = useRouter();

  // STATE & EFFECT ======================================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [range, setRange] = useState({
    start: null,
    end: null,
  });

  useEffect(() => {
    if (wallet?.account && wallet?.connectors?.injected) return;

    wallet.connect("injected");
  }, [wallet?.account]);

  // HELPERS =============================================================================

  function areInputsMissing() {
    return (
      title.length === 0 ||
      description.length === 0 ||
      range.start === null ||
      range.end === null
    );
  }

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
      name: title,
      body: description,
      choices: ["upvote", "downvote"],
      start: Math.round(new Date(range.start).getTime() / 1e3),
      end: Math.round(new Date(range.end).getTime() / 1e3),
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

    var res = await fetch(url, init);
    if (res.ok) {
      router.back();
    } else {
      //TODO add toast or something to indicate failure to client
    }
  }

  // RENDERER ============================================================================

  return (
    <Fragment>
      <Breadcrumbs />
      <Title
        title="New Problem"
        subtitle="Please fill out all the required fields of the form to create a new problem."
        topSpacing={7 * GU}
        bottomSpacing={5 * GU}
      />
      <div style={{ paddingLeft: `${2 * GU}px`, width: "80%", marginBottom: "150px"}}>
        <Field label="Problem title:" required={true}>
          <TextInput
            placeholder="Short summary of the problem"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>
        <Field label="Problem description:" required={true}>
          <TextInput
            placeholder="Comprehensive problem description"
            wide={true}
            multiline={true}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>
        <Field label="Voting window" onChange={setRange} required={true}>
          <div style={{ marginTop: `${2 * GU}px` }}>
            <DateRangePicker
              startDate={range.start}
              endDate={range.end}
              onChange={setRange}
            />
          </div>
        </Field>
        <Button
          style={{ marginTop: `${3 * GU}px` }}
          mode="strong"
          disabled={areInputsMissing()}
          external={false}
          wide={false}
          onClick={() => createProblem()}
        >
          Submit Problem
        </Button>
      </div>
    </Fragment>
  );
};

export default ProposalForm;
