import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GU, Split, DropDown, LoadingRing } from "@aragon/ui";

import Title from "../../../../components/Title";
import "../../../../styles/index.less";
import Header from "../../../../components/Header";
import SolutionDescription from "../../../../components/DescriptionBoxes/SolutionDescription";
import ReportSolutionIndicator from "../../../../components/ReportSolutionIndicator";
import { ARAGON_LOGO } from "../../../../lib/constants";
import {
  ProposalPayload,
  SnapshotData,
  VotePayload,
  VoteResult,
} from "../../../../lib/types";

const SolutionsPage = () => {
  const router = useRouter();
  const { project, problem } = router.query;

  // STATE & EFFECT ======================================================================

  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState<VoteResult[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [done, setDone] = useState(false);
  const [
    proposalCategories,
    setProposalCategories,
  ] = useState<ProposalCategories>({
    active: [],
    closed: [],
    pending: [],
    all: [],
  });

  // Pull all the problem belonging to the given project from the backend.
  useEffect(() => {
    fetch(`http://127.0.0.1:4040/solutions/${project}/${problem}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((data) => Object.values(data))
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
        setProposalCategories(categories);
        setLoadingProposals(false);
      })
      .catch((reason) => {
        setError(reason);
      });
  }, []);

  // Pull all the votes related to each problem from Snapshot.
  useEffect(() => {
    setDone(false);
    async function fetchVotes() {
      if (loadingProposals) {
        console.log("abort fetching votes.");
        return;
      }

      console.log("fetching votes");
      let vote_results: VoteResult[] = [];
      const currCategory = Object.values(proposalCategories)[selected];
      for (let proposal of currCategory) {
        const res = await fetch(
          `https://testnet.snapshot.page/api/aragon/proposal/${proposal.authorIpfsHash}`
        );
        if (!res.ok) {
          throw Error(res.statusText);
        }
        const data = await res.json();
        const votes: SnapshotData[] = Object.values(data);

        //compute voting results.
        // TODO compute results w.r.t. to a strategy. Currently, each vote is weighted
        // equally, idenpendetly of any erc-20 tokens.
        let percentage_downvotes = -1;
        if (votes.length) {
          function reducer(acc: number, curr: SnapshotData) {
            const vote = curr.msg.payload as VotePayload;
            return acc + vote.choice - 1;
          }
          const no_upvotes = votes.reduce(reducer, 0);
          percentage_downvotes = (no_upvotes / votes.length) * 100;
        }

        const result: VoteResult = {
          problem: proposal,
          percentage: percentage_downvotes,
        };
        vote_results.push(result);
      }
      console.log("all votes fetched");
      setVotes(vote_results);
      setDone(true);
    }
    fetchVotes();
  }, [loadingProposals, selected]);

  // RENDERER ============================================================================

  return (
    <Fragment>
      {/* <Breadcrumbs /> */}
      <Header
        illustration={ARAGON_LOGO}
        title={capitalize(project.toString())}
        subtitle="Govern better, together."
      />
      <section
        style={{ display: "flex", width: "100%", marginTop: `${5 * GU}px` }}
      >
        <div style={{ width: "75%" }}>
          <Split
            primary={
              <Title
                title="Solutions"
                subtitle="List of solutions proposed by the community"
                bottomSpacing={0 * GU}
              />
            }
            secondary={
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: `${10 * GU}px ${2 * GU}px ${8 * GU}px`,
                }}
              >
                <DropDown
                  items={["Active", "Closed", "Pending", "All"]}
                  selected={selected}
                  onChange={setSelected}
                />
              </div>
            }
          />
          {done ? (
            votes
              .sort((a, b) => a.percentage - b.percentage)
              .map((v: VoteResult, i) => (
                <SolutionDescription
                  key={i}
                  problem={v.problem}
                  downvotes={v.percentage}
                />
              ))
          ) : (
            <div
              style={{
                height: "400 px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "50px 0 250px 0",
              }}
            >
              <LoadingRing mode="half-circle" />
            </div>
          )}
        </div>
        <div style={{ width: "25%", paddingTop: `${6 * GU}px` }}>
          <ReportSolutionIndicator
            projectName={project}
            problemHash={problem}
          />
        </div>
      </section>
    </Fragment>
  );
};

export default SolutionsPage;

export function capitalize(name: string): string {
  const firstLetter = name.charAt(0);
  const rest = name.slice(1);
  const firstCapital = firstLetter.toUpperCase();
  return firstCapital.concat(rest);
}

// TYPES =================================================================================

type ProposalCategories = {
  active: SnapshotData[];
  closed: SnapshotData[];
  pending: SnapshotData[];
  all: SnapshotData[];
};
