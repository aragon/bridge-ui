import React from "react";
import Link from "next/link";
import { Box, GU, Button } from "@aragon/ui";
import { SOLUTION_ICON } from "../lib/constants";

function ReportSolutionIndicator({ projectName, problemHash }) {
  // RENDERER ============================================================================

  return (
    //FIXME Scrolling doesn't work when mouse is on the problem indicator.
    <Box style={{ position: "fixed", top: "300px" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img style={{ display: "block" }} src={SOLUTION_ICON} alt="" />
        <h1
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            marginTop: `${1.5 * GU}px`,
            marginBottom: `${0.5 * GU}px`,
          }}
        >
          Report a Solution
        </h1>
        <p style={{ fontSize: "16px", marginBottom: `${2 * GU}px` }}>
          ... and get rewarded
        </p>
        <Link
          href={{
            pathname: "/[project]/[problem]/proposal",
            query: { project: projectName, problem: problemHash },
          }}
          passHref
        >
          <Button
            mode="strong"
            external={false}
            label="Create new problem"
          />
        </Link>
      </div>
    </Box>
  );
}

export default ReportSolutionIndicator;
