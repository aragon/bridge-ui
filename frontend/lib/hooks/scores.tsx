import { useEffect, useState } from "react";
import snapshotPckg from "@snapshot-labs/snapshot.js/";

import { Project, Proposal, ProposalPayload, SnapshotData } from "../types";

//TODO exchange Proposal for SnapshotData eventually.
export function useScores(
  spaceInfo: [string, Project],
  proposal: Proposal,
  votes: SnapshotData[]
): Record<string, number> {
  const [scores, setScores] = useState(null);
  useEffect(() => {
    if (spaceInfo && proposal && votes) {
      const provider = snapshotPckg.utils.getProvider(spaceInfo[1].network);
      const voters = votes.map((v) => v.address);
      const snapshot: string = (proposal.msg
        .payload as ProposalPayload).snapshot.toString();
      const t: number = parseInt(snapshot);

      snapshotPckg.utils
        .getScores(
          spaceInfo[0],
          spaceInfo[1].strategies,
          spaceInfo[1].network,
          provider,
          voters,
          t
        )
        .then((scores) => {
          setScores(scores);
        });
    }
  }, [spaceInfo, proposal, votes]);
  return scores;
}
