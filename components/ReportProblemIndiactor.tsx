//TODO merge this component with ProblemDescription component
import React from "react";
import PropTypes from "prop-types";
import { Box, GU, useTheme, Button } from "@aragon/ui";
import { PROBLEM_ICON } from "../lib/constants";
import VotingButtons from "./VotingButtons";

function ReportProblemIndicator() {
  const theme = useTheme();
  return (
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
          }}
        >
          ... and get rewarded
        </p>
        <Button mode="negative" label="Create new problem" />
      </div>
    </Box>
  );
}

export default ReportProblemIndicator;
