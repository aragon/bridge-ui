import React, { Fragment, useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import { GU, Box, Button } from "@aragon/ui";

import Title from "../../components/Title";
import { ARAGON_LOGO, PROBLEM_ICON } from "../../lib/constants";
import "../../styles/index.less";
import Header from "../../components/Header";
import ProblemDescription from "../../components/DescriptionBoxes/ProblemDescription";
import Breadcrumbs from "../../components/Breadcrumb";

const ProblemsPage = (props) => {
  const router = useRouter();

  const [no_fetch, setHasFetched] = useState(0)
  const [proposals, setProposals] = useState<Proposal[]>([]);
  useEffect(() => {
    console.log("first effect")
    if(no_fetch > 2 ) return
    fetch("https://hub.snapshot.page/api/aragon/proposals")
    .then((response) => response.json())
    .then((data) => Object.values(data).slice(1,5))
    .then((data) => data.map(d => { 
      return new Proposal(d.authorIpfsHash, d.msg.payload.name, d.msg.payload.body, d.address)
    }))
      .then((proposals) => setProposals(proposals));
    setHasFetched(no_fetch + 1)
  }, [proposals]);
  
  const [votes, setVotes] = useState<Vote[]>([]);
  useEffect(() => {
    console.log("second effect")
    for (let p of proposals) {
      fetch("https://hub.snapshot.page/api/aragon/proposal/" + p.hash)
        .then((response) => response.json())
        .then((data) => Object.values(data))
        .then((votes) => votes.map((vote) => {
          return new Vote(p, vote.msg.payload.choice)
        }))
        .then(mapped_votes => {
          let newVotes = votes.concat(mapped_votes)
          setVotes(newVotes)
        })
    }
  }, [proposals]);

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
              proposals.map((p, i) => dataToCards(votes, p, i))
          )}
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
              <img style={{ display: "block" }} src={PROBLEM_ICON} alt="" />
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
              <Button mode="negative" label="Create new problem" />
            </div>
          </Box>
        </div>
      </section>
    </Fragment>
  );
};

export default withRouter(ProblemsPage);

function dataToCards(votes, proposal, index) {
  // console.log(votes)
  let relevant_votes = votes.filter(vote => vote.proposal.hash == proposal.hash)
  let upvotes = 0
  let downvotes = 0
  relevant_votes.forEach(vote => {
    if (vote.choice === 1) {
      upvotes++;
    } else if (vote.choice === 2) {
      downvotes++;
    }
  })
  return (
    <ProblemDescription
      key={index}
      title={proposal.title}
      description={proposal.description}
      reporter={proposal.reporter}
      no_upvotes={upvotes}
      no_downvotes={downvotes}
    />
  )
}

class Proposal {
  hash: String
  title: String
  description: String
  reporter: String
  // upvote: number
  // downvote: number

  constructor(proposal, title, description, reporter) {
    this.hash = proposal
    this.title =  title
    this.description =  description
    this.reporter =  reporter
    // this.upvote = 0
    // this.downvote = 0
  }
}

class Vote {
  proposal: Proposal
  choice: number

  constructor(proposal, choice) {
    this.proposal = proposal
    this.choice = choice
  }
}