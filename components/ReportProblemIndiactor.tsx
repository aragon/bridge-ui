import React from "react";
import Link from "next/link";
import { Box, GU, Button } from "@aragon/ui";
import { PROBLEM_ICON } from "../lib/constants";

function ReportProblemIndicator({ projectName }) {
  // RENDERER ============================================================================

  return (
    //FIXME Scrolling doesn't work when mouse is on the problem indicator.
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
        <p style={{ fontSize: "16px", marginBottom: `${2 * GU}px` }}>
          ... and get rewarded
        </p>
        <Link
          href={{
            pathname: "/[project]/proposal",
            query: { project: projectName },
          }}
          passHref
        >
          <Button
            mode="negative"
            external={false}
            label="Create new problem"
            href="/proposal"
          />
        </Link>
      </div>
    </Box>
  );
}

export default ReportProblemIndicator;
