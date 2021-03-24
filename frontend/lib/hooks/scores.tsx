import { useEffect, useState } from "react";
import snapshotPckg from "@snapshot-labs/snapshot.js/";

import { Project, Proposal, ProposalPayload, SnapshotData } from "../types";

//TODO exchange Proposal for SnapshotData eventually.
export function useScores(
  space: Project,
  proposal: Proposal,
  votes: SnapshotData[]
): Record<string, number> {
  const [scores, setScores] = useState(null);
  useEffect(() => {
    if (space && proposal && votes) {
      const provider = snapshotPckg.utils.getProvider(space.network);
      const voters = votes.map((v) => v.address);
      const snapshot: string = (proposal.msg
        .payload as ProposalPayload).snapshot.toString();
      const t: number = parseInt(snapshot);
      console.log(typeof t);

      snapshotPckg.utils
        .getScores(
          space.name.toLowerCase(),
          space.strategies,
          space.network,
          provider,
          voters,
          t
        )
        .then((scores) => {
          console.log("These are the scores:");
          console.log(scores);
          setScores(scores);
        });
    }
  }, [space, proposal, votes]);
  return scores;
}
