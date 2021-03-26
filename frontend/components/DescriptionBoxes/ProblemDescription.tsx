//TODO merge this component with SolutionDescription component
import React from "react";
import { Card, GU, Button } from "@aragon/ui";
import Link from "next/link";

import VotingButtons from "../VotingButtons";
import { ProposalPayload, SnapshotData } from "../../lib/types";

function ProblemDescription({ problem, downvotes }: ProblemDescriptionInfo) {
  return (
    <Card
      width="95%"
      height="auto"
      style={{
        marginTop: `${4 * GU}px`,
        background: "#FFF4F6",
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
        }}
      >
        <p style={{ fontSize: "14px" }}>Reported by: {problem.address}</p>
        <Link
          href={{
            pathname: "/[projectId]/[problem]/solutions",
            query: {
              projectId: problem.msg.space,
              problem: problem.authorIpfsHash,
            },
          }}
          passHref
        >
          <Button external={false} mode="strong">
            Solutions
          </Button>
        </Link>
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
            {(problem.msg.payload as ProposalPayload).name}
          </h1>
          <p style={{ fontSize: "16px" }}>
            {(problem.msg.payload as ProposalPayload).body}
          </p>
        </div>
      </section>
      {downvotes > -1 ? (
        <VotingButtons
          proposal={problem.authorIpfsHash}
          no_upvotes={(100 - downvotes).toFixed().concat(" &")}
          no_downvotes={downvotes.toFixed().concat(" &")}
        />
      ) : (
        <VotingButtons
          proposal={problem.authorIpfsHash}
          no_upvotes={"no votes!"}
          no_downvotes={"no votes!"}
        />
      )}
    </Card>
  );
}

export default ProblemDescription;

// TYPES =================================================================================

type ProblemDescriptionInfo = {
  problem: SnapshotData;
  downvotes: number;
};
