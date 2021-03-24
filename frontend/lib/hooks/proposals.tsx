import { useEffect, useState } from "react";

import { IpfsProposal, Msg, Proposal, SnapshotData } from "../types";

// TODO create generic, parametrized return type: T | Error for custom hooks that
// returns the value, or an error. (or maybe T | bool | Error)

export function useProposal(ifpsHash: string): Proposal {
  const [proposal, setProposal] = useState<Proposal>(null);

  useEffect(() => {
    fetch(`https://ipfs.fleek.co/ipfs/${ifpsHash}`)
      .then((res) => res.text())
      .then((data) => {
        const p: IpfsProposal = JSON.parse(data);
        const m: Msg = JSON.parse(p.msg);
        const prop: Proposal = JSON.parse(data);
        prop.msg = m;
        setProposal(prop);
        console.log("Got proposal: \n" + proposal);
      });
  }, [ifpsHash]);

  return proposal;
}

export function useProblems(spaceName: String): SnapshotData[] {
  const [problems, setProblems] = useState<SnapshotData[]>(null);

  useEffect(() => {
    //TODO fetch problems for given space via backend
  }, [spaceName]);

  return problems;
}

export function useSolutions(spaceName: String, problemHash): SnapshotData[] {
  const [solutions, setSolutions] = useState<SnapshotData[]>(null);

  useEffect(() => {
    //TODO fetch solutions for given space via backend
  }, [spaceName]);

  return solutions;
}
