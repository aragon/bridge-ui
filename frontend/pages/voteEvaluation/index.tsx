import React from "react";
import { LoadingRing } from "@aragon/ui";

import "../../styles/index.less";
import { ProposalPayload, SnapshotData, VotePayload } from "../../lib/types";
import { useSpace } from "../../lib/hooks/spaces";
import { useProposal } from "../../lib/hooks/proposals";
import { useScoredVotes, useVotes } from "../../lib/hooks/votes";
import { useScores } from "../../lib/hooks/scores";

const EvalPage = () => {
  const proposalHashes = [
    "QmdWNTEAZFCL5kvaJnBD3T52QanSKSVFAxVLWqUeAKbnwf",
    "QmWXJvo5zXA2uSgMMCLSyFgwxnpHKP2D7NM4RqDriNjEwo",
    "QmVfnDY4MNJGBHeH5NmgfH5xCZcqsFa6gs2a6scfCGJapK",
  ];
  const spaceName = "aragon";
  const aragonSpace = useSpace(spaceName);
  const testProposal = useProposal(proposalHashes[0]);
  const votes = useVotes(proposalHashes[0]);
  const scores = useScores(aragonSpace, testProposal, votes);
  const scoredVotes = useScoredVotes(aragonSpace, testProposal, votes, scores);

  // HELPERS =============================================================================

  function isDataReady() {
    return aragonSpace && votes && testProposal && scores && scoredVotes;
  }

  // function votesPerChoice() {
  //   const proposalPayload = testProposal.msg.payload as ProposalPayload;
  //   const res = proposalPayload.choices.map(
  //     (_, i) =>
  //       votes.filter((vote: SnapshotData) => {
  //         const votePayload = vote.msg.payload as VotePayload;
  //         return votePayload.choice === i + 1;
  //       }).length
  //   );
  //   return res;
  // }

  // function balancePerChoice() {
  //   const proposalPayload = testProposal.msg.payload as ProposalPayload;
  //   const res = proposalPayload.choices.map((_, i) =>
  //     Object.values(scoredVotes)
  //       .filter((vote) => {
  //         //TODO correctly type this
  //         const votePayload = vote.msg.payload as VotePayload;
  //         return votePayload.choice === i + 1;
  //       })
  //       // .reduce(reducer, 0)
  //       .reduce((a, b: any) => a + b.balance, 0)
  //   );
  //   return res;
  // }

  // function balancePerStrategyPerChoice() {
  //   const proposalPayload = testProposal.msg.payload as ProposalPayload;
  //   const res = proposalPayload.choices.map((_, i) =>
  //     aragonSpace[1].strategies.map((_, j) =>
  //       Object.values(votes)
  //         .filter((vote: any) => vote.msg.payload.choice === i + 1)
  //         .reduce((a, b: any) => a + b.scores[j], 0)
  //     )
  //   );
  //   return res;
  // }

  // function proposalBalance(): number {
  //   return Object.values(scoredVotes).reduce(
  //     (a, b: any) => a + b.balance,
  //     0
  //   ) as number;
  // }

  // RENDERER ============================================================================
  if (!isDataReady()) {
    return <LoadingRing />;
  }

  return (
    <>
      {/* <textarea
        name=""
        id=""
        readOnly
        rows={15}
        value={JSON.stringify(
          balancePerChoice().map((b: number) => (b * 100) / proposalBalance()),
          // balancePerChoice(),
          null,
          2
        )}
      ></textarea> */}
    </>
  );
};

export default EvalPage;

// OLD useEffect WITH BATCH FETCHING
// useEffect(() => {
//   const a = proposalHashes.map(fetchProposal);
//   Promise.all(a).then((ps: IpfsProposal[]) => {
//     setProposals(ps);
//   });
// }, []);
