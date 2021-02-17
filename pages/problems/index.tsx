import React, { Fragment, useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import { GU, Box, Button } from "@aragon/ui";

import Title from "../../components/Title";
import { ARAGON_LOGO, PROBLEM_ICON } from "../../lib/constants";
import "../../styles/index.less";
import Header from "../../components/Header";
import ProblemDescription from "../../components/DescriptionBoxes/ProblemDescription";
import Breadcrumbs from "../../components/Breadcrumb";

const PROBLEMS = [
  {
    project: "Aragon",
    product: "Apollo",
    title: "Not enough money",
    description: "Switzerland is expensive af.",
    reporter: "Me",
    no_upvotes: 42,
    no_downvotes: 42,
  },
  {
    project: "Aragon",
    product: "Apollo",
    title: "Lockdown",
    description: "Meeting people online is just not the same.",
    reporter: "Me",
    no_upvotes: 42,
    no_downvotes: 42,
  },
  {
    project: "Aragon",
    product: "Apollo",
    title: "House MD not on netflix",
    description: "I don't care whose fault it is, just fix it pls.",
    reporter: "Me",
    no_upvotes: 42,
    no_downvotes: 42,
  },
  {
    project: "Aragon",
    product: "Apollo",
    title: "Linear Gradients in React",
    description:
      "Different browsers support different gradient functions. Don't know how to express that in react css.",
    reporter: "Me",
    no_upvotes: 42,
    no_downvotes: 42,
  },
];

const ProblemsPage = (props) => {
  const router = useRouter();
  const [proposals, setProposals] = useState([])

  useEffect(() => {
    fetch('https://hub.snapshot.page/api/aragon/proposals')
      .then(response => response.json())
      .then(data => Object.values(data))
      .then(proposals => setProposals(proposals))
      // .then(console.log)
  })
  
  return (
    <Fragment>
      <Breadcrumbs/>
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
      <section
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        <div style={{ width: "75%" }}>
          {proposals.length === 0 ? <p>loading...</p> : proposals.map(dataToCards) }
        </div>
        <div style={{ width: "25%" }}>
          <Box style={{ position: "fixed" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                style={{display: "block",}}
                src={PROBLEM_ICON}
                alt=""
              />
              <h1
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  marginTop: `${1.5 * GU}px`,
                  marginBottom: `${0.5 * GU}px`,
                }}
              >
                Report a Problem
              </h1>
              <p
                style={{
                  fontSize: "16px",
                  marginBottom: `${2 * GU}px`,
                  // color: `${theme.surfaceContentSecondary}`,
                }}
              >
                ... and get rewarded
              </p>
              <Button mode="negative" label="Create new problem"/>
            </div>
          </Box>
        </div>
      </section>
    </Fragment>
  );
};

export default withRouter(ProblemsPage);

function dataToCards( proposal , index) {
  return (
    <ProblemDescription
      key={index}
      title={proposal.msg.payload.name}
      description={proposal.msg.payload.body}
      reporter={proposal.address}
      no_upvotes={42}
      no_downvotes={42}
    />
  );
}
