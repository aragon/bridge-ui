import { useEffect, useState } from "react";
import { IpfsProposal, Msg, Proposal, SnapshotData } from "../types";

// TODO create generic, parametrized return type: T | Error for custom hooks that
// returns the value, or an error. (or maybe T | bool | Error)

export function useVotes(proposalHash: string): SnapshotData[] {
  const [votes, setVotes] = useState<SnapshotData[]>(null);

  useEffect(() => {
    fetch(`https://hub.snapshot.org/api/aragon/proposal/${proposalHash}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVotes(Object.values(data));
      });
  }, [proposalHash]);

  return votes;
}
