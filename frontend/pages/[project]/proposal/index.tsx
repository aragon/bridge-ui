import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSigner } from "@vocdoni/react-hooks";
import { useWallet } from "use-wallet";
import {
  GU,
  Box,
  Button,
  Field,
  TextInput,
  DateRangePicker,
  LoadingRing,
} from "@aragon/ui";
import snapshotPckg from "@snapshot-labs/snapshot.js/";

import { BACKEND_URL } from "../../../lib/constants";
import Title from "../../../components/Title";
import "../../../styles/index.less";
import { useSpace } from "../../../lib/hooks/spaces";
import CheckboxWrap from "../../../components/CheckboxWrap";

function ProposalForm() {
  const signer = useSigner();
  const wallet = useWallet();
  const router = useRouter();

  //Typehack
  const { projectId } = router.query;
  let pId: string = "";
  if (typeof projectId === "string") pId = projectId;

  //reference for the state of the checkboxes. See CheckBoxWrap for more information.
  const checkdRef = useRef(fixedTags.map((_) => false));
  const space = useSpace(pId);
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

  async function postProblem() {
    const provider = snapshotPckg.utils.getProvider(space[1].network);
    const blockNumber = await snapshotPckg.utils.getBlockNumber(provider);
    const payload = {
      name: title,
      body: description,
      choices: ["upvote", "downvote"],
      start: Math.round(new Date(range.start).getTime() / 1e3),
      end: Math.round(new Date(range.end).getTime() / 1e3),
      snapshot: blockNumber,
      metadata: {
        strategies: space[1].strategies,
      },
    };
    const envelope: any = {
      address: wallet.account,
      msg: JSON.stringify({
        version: "0.1.3",
        timestamp: (Date.now() / 1e3).toFixed(),
        space: pId,
        type: "proposal",
        payload,
      }),
    };
    envelope.sig = await signer.signMessage(envelope.msg);

    const url = `${BACKEND_URL}/problemProposal/${pId}`;
    const init = {
      method: "POST",
      body: JSON.stringify(envelope),
    };

    //TODO add toast or something to indicate success/failure to client
    var res = await fetch(url, init);
    if (res.ok) {
      router.back();
    } else {
      router.back();
    }
  }

  // RENDERER ============================================================================

  if (!space) {
    return (
      <div>
        <LoadingRing />
      </div>
    );
  }

  return (
    <>
      <Title
        title="New Problem"
        subtitle="Please fill out all the required fields of the form to propose a new problem."
        topSpacing={7 * GU}
        bottomSpacing={5 * GU}
      />
      <div
        style={{
          paddingLeft: `${2 * GU}px`,
          width: "80%",
          marginBottom: "150px",
        }}
      >
        <Field label="Problem Title:" required={true}>
          <TextInput
            placeholder="Short summary of the problem"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>
        <Field label="Tags:" required={true}>
          <Box
            style={{
              marginTop: `${2 * GU}px`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-start",
                flexWrap: "wrap",
                alignContent: "space-between",
              }}
            >
              {fixedTags.map((t, i) => (
                <CheckboxWrap
                  label={t}
                  cRef={checkdRef}
                  index={i}
                ></CheckboxWrap>
              ))}
            </div>
          </Box>
        </Field>
        <Field label="Problem Description:" required={true}>
          <TextInput
            placeholder="Comprehensive problem description"
            wide={true}
            multiline={true}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>
        <Field label="Voting Window" onChange={setRange} required={true}>
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
          onClick={() => postProblem()}
        >
          Submit
        </Button>
      </div>
    </>
  );
}

export default ProposalForm;

const fixedTags = [
  "Development",
  "Design",
  "Finances",
  "Admin",
  "Customer Support",
  "Tokenomics",
  "Legal",
  "Sales",
  "Marketing",
  "Communication",
];
