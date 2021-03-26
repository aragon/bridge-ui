import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";

import {
  IpfsProposal,
  Msg,
  Proposal,
  ProposalCategories,
  ProposalPayload,
  SnapshotData,
} from "../types";

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
      });
  }, [ifpsHash]);

  return proposal;
}

export function useCategorizedProblems(spaceId: String): ProposalCategories {
  const [
    categorizedProblems,
    setCategorizedProblems,
  ] = useState<ProposalCategories>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/problems/${spaceId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((data) => {
        return Object.values(data);
      })
      .then((data: SnapshotData[]) => {
        let categories = {
          active: [],
          closed: [],
          pending: [],
          all: data,
        };
        let curr_date = Math.round(Date.now() / 1e3);
        function categorize(p: SnapshotData) {
          const proposalInfo = p.msg.payload as ProposalPayload;
          if (proposalInfo.end < curr_date) {
            categories.closed.push(p);
          } else if (proposalInfo.start > curr_date) {
            categories.pending.push(p);
          } else {
            categories.active.push(p);
          }
        }
        data.forEach(categorize);
        setCategorizedProblems(categories);
      });
  }, [spaceId]);

  return categorizedProblems;
}

export function useCategorizedSolutions(
  spaceId: string,
  problemHash: string
): ProposalCategories {
  const [
    categorizedSolutions,
    setCategorizedSolutions,
  ] = useState<ProposalCategories>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/solutions/${spaceId}/${problemHash}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((data) => {
        return Object.values(data);
      })
      .then((data: SnapshotData[]) => {
        let categories = {
          active: [],
          closed: [],
          pending: [],
          all: data,
        };
        let curr_date = Math.round(Date.now() / 1e3);
        function categorize(p: SnapshotData) {
          const proposalInfo = p.msg.payload as ProposalPayload;
          if (proposalInfo.end < curr_date) {
            categories.closed.push(p);
          } else if (proposalInfo.start > curr_date) {
            categories.pending.push(p);
          } else {
            categories.active.push(p);
          }
        }
        data.forEach(categorize);
        setCategorizedSolutions(categories);
      });
  }, [spaceId]);

  return categorizedSolutions;
}
