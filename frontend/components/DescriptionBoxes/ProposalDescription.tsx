import React from "react";
import { Card, GU, Button } from "@aragon/ui";
import Link from "next/link";

import VotingButtons from "../VotingButtons";
import { ProposalPayload, TaggedProposal } from "../../lib/types";
import "../../styles/index.less";

type ProposalDescriptionInfo = {
  type: string;
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
  proposal,
  downvotes,
}: ProposalDescriptionInfo) {
  const styleClass = type === "problem" ? "problemCard" : "solutionCard";
  if (!proposal.tags) {
    proposal.tags = [];
  }
  return (
    <Card width="95%" height="auto" id={styleClass}>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          width: "100%",
          padding: `${2 * GU}px ${2 * GU}px ${2 * GU}px  ${3 * GU}px`,
          borderRadius: "10px",
          alignItems: "center",
        }}
      >
        <p
          style={{ alignContent: "center", fontSize: "14px", color: "#666666" }}
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
        </div>
        <section
          style={{
            marginTop: `${2 * GU}px`,
          }}
        >
          {proposal.tags.map((t) => (
            <Button
              style={{
                marginRight: `${1 * GU}px`,
                background: "#EEF3FF",
                borderRadius: "8px",
                boxShadow: "inset 0px 4px 4px rgba(122, 133, 159, 0.1)",
              }}
              disabled={true}
            >
              {t}
            </Button>
          ))}
        </section>
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
