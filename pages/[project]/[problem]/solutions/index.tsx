import React, { Fragment, useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import { GU, DropDown, Split } from "@aragon/ui";

import Title from "../../../../components/Title";
import "../../../../styles/index.less";
import Header from "../../../../components/Header";
import Breadcrumbs from "../../../../components/Breadcrumb";
import SolutionDescription from "../../../../components/DescriptionBoxes/SolutionDescription";
import ReportSolutionIndicator from "../../../../components/ReportSolutionIndicator";
import { ARAGON_LOGO } from "../../../../lib/constants";

const SolutionsPage = () => {
  const router = useRouter();
  const { project, problem } = router.query;

  // STATE & EFFECT ======================================================================
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(0);
  const [
    proposalCategories,
    setProposalCategories,
  ] = useState<ProposalCategories>({
    active: [],
    closed: [],
    pending: [],
    all: [],
  });

  // get all problems related to a particular project from snapshot
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
      .then((data: Proposal[]) => {
        let curr_date = Math.round(Date.now() / 1e3);
        let categories: ProposalCategories = {
          active: data.filter(
            (p) =>
              p.msg.payload.start < curr_date && curr_date < p.msg.payload.end
          ),
          closed: data.filter((p) => p.msg.payload.end < curr_date),
          pending: data.filter((p) => p.msg.payload.start > curr_date),
          all: data,
        };
        setProposalCategories(categories);
      })
      .catch((reason) => {
        setError(reason);
      });
  }, []);

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
          {error ? (
            <div style={{ marginTop: `${5 * GU}px`, textAlign: "center" }}>
              <h2>Oops, something seems to have gone wrong!</h2>
            </div>
          ) : Object.values(proposalCategories)[selected].length === 0 ? (
            <div style={{ marginTop: `${5 * GU}px`, textAlign: "center" }}>
              <h2>There are no problems in the selected category.</h2>
            </div>
          ) : (
            Object.values(proposalCategories)[
              selected
            ].map((p: Proposal, i) => (
              <SolutionDescription key={i} project={project} problem={p} />
            ))
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

export default withRouter(SolutionsPage);

export function capitalize(name: string): string {
  const firstLetter = name.charAt(0);
  const rest = name.slice(1);
  const firstCapital = firstLetter.toUpperCase();
  return firstCapital.concat(rest);
}

// TYPES =================================================================================

type ProposalCategories = {
  active: Proposal[];
  closed: Proposal[];
  pending: Proposal[];
  all: Proposal[];
};

export interface Proposal {
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
  payload: Payload;
}

export interface Payload {
  end: number;
  body: string;
  name: string;
  start: number;
  choices: string[];
  metadata: Metadata;
  snapshot: number;
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
