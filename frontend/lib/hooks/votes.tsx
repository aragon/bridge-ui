import { useEffect, useState } from "react";
import { TEST_HUB_URL } from "../constants";
import { Project, Proposal, SnapshotData } from "../types";

// TODO create generic, parametrized return type: T | Error for custom hooks that
// returns the value, or an error. (or maybe T | bool | Error)

export function useVotes(proposalHash: string): SnapshotData[] {
  const [votes, setVotes] = useState<SnapshotData[]>(null);

  useEffect(() => {
    fetch(`${TEST_HUB_URL}/api/aragon/proposal/${proposalHash}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVotes(Object.values(data));
      });
  }, [proposalHash]);

  return votes;
}

export function useScoredVotes(
  spaceInfo: [string, Project],
  proposal: Proposal,
  votes: SnapshotData[],
  scores: Record<string, number>
) {
  const [modifiedVotes, setModVotes] = useState(null);

  useEffect(() => {
    if (spaceInfo && proposal && votes && scores) {
      const ammendedVotes = Object.fromEntries(
        Object.entries(votes)
          .map((vote: any) => {
            vote[1].scores = spaceInfo[1].strategies.map(
              (_, i) => scores[i][vote[1].address] || 0
            );
            vote[1].balance = vote[1].scores.reduce((a, b: any) => a + b, 0);
            return vote;
          })
          .sort((a, b) => b[1].balance - a[1].balance)
          .filter((vote) => vote[1].balance > 0)
      );
      setModVotes(ammendedVotes);
    }
  }, [spaceInfo, proposal, votes, scores]);

  return modifiedVotes;
}
