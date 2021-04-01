import React from "react";
import { Card, GU, Button } from "@aragon/ui";
import Link from "next/link";

import VotingButtons from "../VotingButtons";
import { ProposalPayload, TaggedProposal } from "../../lib/types";

type ProposalDescriptionInfo = {
  type: string;
  projectId: string;
  problemId?: string;
  proposal: TaggedProposal;
  downvotes: number;
};

type LinkInfo = {
  projectId: string;
  problemId: string;
  solutionId?: string;
};

function SolutionsButton(linkInfo: LinkInfo) {
  return (
    <Link
      href={{
        pathname: "/[projectId]/[problemId]/solutions",
        query: {
          projectId: linkInfo.projectId,
          problemId: linkInfo.problemId,
        },
      }}
      passHref
    >
      <Button external={false} mode="strong">
        Solutions
      </Button>
    </Link>
  );
}

function ApplicationsButton(linkInfo: LinkInfo) {
  return (
    <Link
      href={{
        pathname: "/[projectId]/[problem]/[applications]",
        query: {
          projectId: linkInfo.projectId,
          problem: linkInfo.problemId,
          solution: linkInfo.solutionId, //TODO change this, when applications will be enabled
        },
      }}
      passHref
    >
      <Button external={false} mode="inactive" disabled={true}>
        Apply
      </Button>
    </Link>
  );
}

function ProposalDescription({
  type,
  projectId,
  proposal,
  downvotes,
}: ProposalDescriptionInfo) {
  const backgroudColor = type === "problem" ? "#FFF4F6" : "#F6FCFF";
  if (!proposal.tags) {
    proposal.tags = [];
  }
  return (
    <Card
      width="95%"
      height="auto"
      style={{
        marginTop: `${4 * GU}px`,
        background: backgroudColor,
        borderRadious: `10px`,
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          width: "100%",
          padding: `${2 * GU}px ${2 * GU}px ${2 * GU}px  ${3 * GU}px`,
          borderRadius: "10px",
          border: "solid",
          alignItems: "center",
        }}
      >
        <p
          style={{ alignContent: "center", border: "solid", fontSize: "14px" }}
        >
          Reported by: {proposal.address}
        </p>
        {type === "problem" ? (
          <SolutionsButton
            projectId={proposal.msg.space}
            problemId={proposal.hash}
          />
        ) : (
          <ApplicationsButton
            projectId={proposal.msg.space}
            problemId={proposal.hash}
          />
        )}
      </section>
      <section
        style={{
          width: "100%",
          padding: `${1 * GU}px ${2 * GU}px ${2 * GU}px  ${3 * GU}px`,
          borderRadius: "10px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "25px",
              fontWeight: "bold",
              marginBottom: `${0.5 * GU}px`,
            }}
          >
            {(proposal.msg.payload as ProposalPayload).name}
          </h1>
          <p style={{ fontSize: "16px" }}>
            {(proposal.msg.payload as ProposalPayload).body}
          </p>
          {proposal.tags.map((t) => (
            <Button>{t}</Button>
          ))}
        </div>
      </section>
      {downvotes > -1 ? (
        <VotingButtons
          spaceId={proposal.msg.space}
          proposal={proposal.hash}
          no_upvotes={(100 - downvotes).toFixed().concat(" %")}
          no_downvotes={downvotes.toFixed().concat(" %")}
        />
      ) : (
        <VotingButtons
          spaceId={proposal.msg.space}
          proposal={proposal.hash}
          no_upvotes={"no votes!"}
          no_downvotes={"no votes!"}
        />
      )}
    </Card>
  );
}

export default ProposalDescription;
