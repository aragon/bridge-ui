import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSigner } from "@vocdoni/react-hooks";
import { useWallet } from "use-wallet";
import {
  GU,
  Button,
  Field,
  TextInput,
  DateRangePicker,
  LoadingRing,
} from "@aragon/ui";
import snapshotPckg from "@snapshot-labs/snapshot.js/";

import { BACKEND_URL } from "../../../../lib/constants";
import Title from "../../../../components/Title";
import "../../../../styles/index.less";
import { useSpace } from "../../../../lib/hooks/spaces";
import CreateProblemOrSolutionForm from "../../../../components/CreateProblemOrSolutionForm";

function ProposalForm() {
  const signer = useSigner();
  const wallet = useWallet();
  const router = useRouter();

  //Typehack.
  const { projectId, problemId } = router.query;
  let projId: string = "";
  if (typeof projectId === "string") projId = projectId;
  let probId: string = "";
  if (typeof problemId === "string") probId = problemId;

  const space = useSpace(projId);
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

  async function postSolution(): Promise<{result: boolean, message: string}> {
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
        space: projId,
        type: "proposal",
        payload,
      }),
    };
    envelope.sig = await signer.signMessage(envelope.msg);

    const url = `${BACKEND_URL}/solutionProposal/${projId}/${probId}`;
    const init = {
      method: "POST",
      body: JSON.stringify(envelope),
    };

    var res = await fetch(url, init);
    if (res.ok) {
      return {result: true, message: 'Solution posted successfully'};
    } else {
      return {result: false, message: 'Failed to post solution'};
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
        isCreateProblem={false}
        shouldToast={true}
        problemId={probId}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        range={range}
        setRange={setRange}
        checkedBoxesRef={null}
        submitForm={postSolution}
        afterSubmissionAction={router.back}
      />
    </>
  );
}

export default ProposalForm;
