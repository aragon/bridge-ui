import React from "react";
import { Card, GU } from "@aragon/ui";
import { PROBLEM_RED, SOLUTION_BLUE } from "../../lib/constants";

function ProductCard({ onOpen, label, img, no_prob, no_sol }) {
  const handleClick = React.useCallback(() => {
    onOpen(label);
  }, [onOpen]);

  return (
    <Card
      onClick={handleClick}
      // css={`
      //   display: flex;
      //   flex-direction: column;
      // `}
    >
      <img src={img} alt="" width="160" height="145" />
      <p style={{ fontSize: "20px", marginTop: `${2 * GU}px` }}>{label}</p>
      <div style={{ padding: `${1 * GU}px` }}>
        <p style={{ color: PROBLEM_RED }}>Problems: {no_prob}</p>
        <p style={{ color: SOLUTION_BLUE }}>Solutions: {no_sol}</p>
      </div>
    </Card>
  );
}
export default ProductCard;
