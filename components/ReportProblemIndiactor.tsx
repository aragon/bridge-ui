import React from "react";
import { Box, GU, useTheme, Button } from "@aragon/ui";
import { PROBLEM_ICON } from "../lib/constants";
import { useSigner } from "@vocdoni/react-hooks";
import { useWallet } from "use-wallet";

function ReportProblemIndicator() {
  const theme = useTheme();
  const signer = useSigner();
  const wallet = useWallet();

  // RENDERER ============================================================================

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
        <p style={{ fontSize: "16px", marginBottom: `${2 * GU}px` }}>
          ... and get rewarded
        </p>
        <Button
          mode="negative"
          external={false}
          label="Create new problem"
          href="/proposal"
        />
      </div>
    </Box>
  );
}

export default ReportProblemIndicator;
