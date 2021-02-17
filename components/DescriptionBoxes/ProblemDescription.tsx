//TODO merge this component with ProblemDescription component
import React from "react";
import PropTypes from "prop-types";
import { Card, GU, useTheme, Button } from "@aragon/ui";
import {
  DOWNARROW_ICON,
  PROBLEM_RED,
  SOLUTION_BLUE,
  UPARROW_ICON,
} from "../../lib/constants";
import VotingButtons from "../VotingButtons";

function ProblemDescription({
  title,
  description,
  reporter,
  no_upvotes,
  no_downvotes,
}) {
  const theme = useTheme();
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
        {/* TODO extract this into component */}
        <p
          style={{
            fontSize: "14px",
            color: `${theme.surfaceContentSecondary}`,
          }}
        >
          Reported by: {reporter}
        </p>
        <Button href="/solutions" external={false} mode="strong">
          Solutions
        </Button>
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
            {title}
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: `${theme.surfaceContentSecondary}`,
            }}
          >
            {description}
          </p>
        </div>
      </section>
      <VotingButtons no_upvotes={no_upvotes} no_downvotes={no_downvotes} />
    </Card>
  );
}

ProblemDescription.propTypes = {
  description: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
};

export default ProblemDescription;
