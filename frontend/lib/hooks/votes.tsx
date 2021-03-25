import { useEffect, useState } from "react";
import { TEST_HUB_URL } from "../constants";
import { SnapshotData } from "../types";

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
