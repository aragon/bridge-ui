import React from "react";
import { Card, GU } from "@aragon/ui";

function ProblemCard({ title, description, no_upvotes, no_downvotes }) {
  //TODO Implement upvote/downvote buttons instead of a card-click-handler
  // const handleClick = React.useCallback(() => {
  //   onOpen(label);
  // }, [onOpen]);

  return (
    <Card /* onClick={handleClick} */>
      <p style={{ fontSize: "20px", marginTop: `${2 * GU}px` }}>{title}</p>
      <p style={{ fontSize: "15px", marginTop: `${2 * GU}px` }}>{description}</p>
      <p style={{ fontSize: "15px", marginTop: `${2 * GU}px` }}>{no_upvotes}</p>
      <p style={{ fontSize: "15px", marginTop: `${2 * GU}px` }}>{no_downvotes}</p>
    </Card>
  );
}

export default ProblemCard;