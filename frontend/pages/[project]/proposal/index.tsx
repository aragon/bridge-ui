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
  ToastHub, 
  Toast,
} from "@aragon/ui";
import snapshotPckg from "@snapshot-labs/snapshot.js/";

import { BACKEND_URL } from "../../../lib/constants";
import Title from "../../../components/Title";
import "../../../styles/index.less";
import { useSpace } from "../../../lib/hooks/spaces";
import CheckboxWrap from "../../../components/CheckboxWrap";
import CreateProblemOrSolutionForm from "../../../components/CreateProblemOrSolutionForm";

function ProposalForm() {
  const signer = useSigner();
  const wallet = useWallet();
  const router = useRouter();

  //Typehack
  const { projectId } = router.query;
  let pId: string = "";
  if (typeof projectId === "string") pId = projectId;

  //reference for the state of the checkboxes. See CheckBoxWrap for more information.
  const checkedBoxesRef = useRef(fixedTags.map((_) => false));
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

  async function postProblem(): Promise<{result: boolean, message: string}> {
    // construct payload to post proposal to snapshot
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
    // wrap payload in envelope
    // NOTE: Snapshot expects envelope and payload to have the above structure.
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

    // filter tags selected by user
    const tags = [];
    checkedBoxesRef.current.forEach((c, i) => {
      if (c) tags.push(fixedTags[i]);
    });

    // Wrap tags and envelope into parcel
    const parcel = {
      snapshot: envelope,
      tags: tags,
    };

    const url = `${BACKEND_URL}/problemProposal/${pId}`;
    const init = {
      method: "POST",
      body: JSON.stringify(parcel),
    };

    const res = await fetch(url, init);
    if (res.ok) {
      return {result: true, message: 'Problem posted successfully'};
    } else {
      return {result: false, message: 'Failed to post problem'};
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
      <CreateProblemOrSolutionForm 
        isCreateProblem={true}
        shouldToast={true}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        range={range}
        setRange={setRange}
        checkedBoxesRef={checkedBoxesRef}
        submitForm={postProblem}
        afterSubmissionAction={router.back}
        waitBeforeAfterAction={4000}
      />
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
