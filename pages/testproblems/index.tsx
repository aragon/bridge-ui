import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GU, Split, DropDown, LoadingRing } from "@aragon/ui";

import Title from "../../components/Title";
import { ARAGON_LOGO, TEST_HUB_URL } from "../../lib/constants";
import "../../styles/index.less";
import Header from "../../components/Header";
import TestProblemDescription from "../../components/DescriptionBoxes/ProblemDescription-copy";
import Breadcrumbs from "../../components/Breadcrumb";
import ReportProblemIndicator from "../../components/ReportProblemIndiactor";
import { capitalize } from "../[project]/[problem]/solutions";

const ProblemsPage = () => {
  const router = useRouter();
  const project = "aragon";

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

  // get problems related to a particular project from snapshot
  useEffect(() => {
    fetch(`http://127.0.0.1:4040/problems/${project}`)
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
        console.log(reason);
        setError(reason);
      });
  }, []);

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
                title="Problems"
                subtitle="List of problems reported by the community"
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
                <TestProblemDescription
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
          <ReportProblemIndicator projectName={project} />
        </div>
      </section>
    </Fragment>
  );
};

export default ProblemsPage;

// TYPES =================================================================================

type ProposalCategories = {
  active: SnapshotData[];
  closed: SnapshotData[];
  pending: SnapshotData[];
  all: SnapshotData[];
};

export interface SnapshotData {
  address: string;
  msg: Msg;
  sig: string;
  authorIpfsHash: string;
  relayerIpfsHash: string;
}

export interface Msg {
  version: string;
  timestamp: string;
  space: string;
  type: string;
  payload: ProposalPayload | VotePayload;
}

export interface ProposalPayload {
  end: number;
  body: string;
  name: string;
  start: number;
  choices: string[];
  metadata: Metadata;
  snapshot: number;
}

export interface VotePayload {
  choice: number;
  metadata: Metadata;
  proposal: string;
}

export interface Metadata {
  strategies: Strategy[];
}

export interface Strategy {
  name: string;
  params: Params;
}

export interface Params {
  symbol: string;
  address: string;
  decimals?: number;
}

export interface VoteResult {
  problem: SnapshotData;
  percentage: number;
}
