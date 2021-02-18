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

const ProblemsPage = (props) => {
  const router = useRouter();

  const [hasFetched, setHasFetched] = useState(false)
  const [proposals, setProposals] = useState<Proposal[]>([]);
  useEffect(() => {
    console.log("first effect")
    // if(no_fetch > 2 ) return
    fetch("https://hub.snapshot.page/api/aragon/proposals")
    .then((response) => response.json())
    .then((data) => Object.values(data).slice(1,7))
    .then((data) => data.map(d => { 
      return new Proposal(d.authorIpfsHash, d.msg.payload.name, d.msg.payload.body, d.address)
    }))
      .then((proposals) => {
        setProposals(proposals)
        setHasFetched(true)
      });
  }, []);
  
  return (
    <Fragment>
      <Breadcrumbs />
      <Header
        illustration={ARAGON_LOGO}
        title="Apollo"
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
              proposals.map((p, i) => dataToCards(p, i))
          )}
        </div>
        <div style={{ width: "25%" }}>
          <ReportProblemIndicator/>
        </div>
      </section>
    </Fragment>
  );
};

export default withRouter(ProblemsPage);

//TODO put this inside component?
function dataToCards(proposal, index) {
  return (
    <ProblemDescription
      key={index}
      problem={proposal}
    />
  )
}

export class Proposal {
  hash: String
  title: String
  description: String
  reporter: String

  constructor(proposal, title, description, reporter) {
    this.hash = proposal
    this.title =  title
    this.description =  description
    this.reporter =  reporter
  }
}
