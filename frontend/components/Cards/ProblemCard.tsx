import React from "react";
import { Card, GU } from "@aragon/ui";

function ProblemCard({ title, description, no_upvotes, no_downvotes }) {
  return (
    <Card >
      <p style={{ fontSize: "20px", marginTop: `${2 * GU}px` }}>{title}</p>
      <p style={{ fontSize: "15px", marginTop: `${2 * GU}px` }}>{description}</p>
      <p style={{ fontSize: "15px", marginTop: `${2 * GU}px` }}>{no_upvotes}</p>
      <p style={{ fontSize: "15px", marginTop: `${2 * GU}px` }}>{no_downvotes}</p>
    </Card>
  );
}

export default ProblemCard;