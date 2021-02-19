import React, { Fragment, useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import { GU } from "@aragon/ui";

import Title from "../../components/Title";
import { ARAGON_LOGO } from "../../lib/constants";
import "../../styles/index.less";
import Header from "../../components/Header";
import ProblemDescription from "../../components/DescriptionBoxes/ProblemDescription";
import Breadcrumbs from "../../components/Breadcrumb";
import ReportProblemIndicator from "../../components/ReportProblemIndiactor";

const ProblemsPage = ({ space = "aragon" }) => {
  const router = useRouter();

  // STATE & EFFECT ======================================================================

  const [proposals, setProposals] = useState<Proposal[]>([]);
  useEffect(() => {
    fetch(`https://testnet.snapshot.page/api/${space}/proposals`)
      .then((response) => response.json())
      .then((data) => Object.values(data).slice(1, 7))
      .then((data) =>
        data.map((d) => {
          return new Proposal(
            space,
            d.authorIpfsHash,
            d.msg.payload.name,
            d.msg.payload.body,
            d.address
          );
        })
      )
      .then((proposals) => {
        setProposals(proposals);
      });
  }, []);

  // RENDERER ============================================================================

  return (
    <Fragment>
      <Breadcrumbs />
      <Header
        illustration={ARAGON_LOGO}
        title={space}
        subtitle="A universally verifiable, censorship-resistant and anonymous voting & grants execution engine."
      />
      <Title
        title="Problems"
        subtitle="List of problems reported by the community"
        topSpacing={7 * GU}
        bottomSpacing={5 * GU}
      />
      <section style={{ display: "flex", width: "100%" }}>
        <div style={{ width: "75%" }}>
          {proposals.length === 0 ? (
            <p>loading...</p>
          ) : (
            proposals.map((p, i) => <ProblemDescription key={i} problem={p} />)
          )}
        </div>
        <div style={{ width: "25%" }}>
          <ReportProblemIndicator />
        </div>
      </section>
    </Fragment>
  );
};

export default withRouter(ProblemsPage);

export class Proposal {
  space: String;
  hash: String;
  title: String;
  description: String;
  reporter: String;

  constructor(space, proposal, title, description, reporter) {
    this.space = space;
    this.hash = proposal;
    this.title = title;
    this.description = description;
    this.reporter = reporter;
  }
}
