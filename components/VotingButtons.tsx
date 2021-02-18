import React from "react";
import PropTypes from "prop-types";
import { Button, useTheme, GU } from "@aragon/ui";
import { DOWNARROW_ICON, UPARROW_ICON } from "../lib/constants";

function VotingButtons({ no_upvotes, no_downvotes }) {
  const theme = useTheme();
  return (
    <section
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: `${2 * GU}px ${2 * GU}px ${2 * GU}px  ${3 * GU}px`,
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Button
          style={{ marginBottom: `${1 * GU}px`, marginRight: `${1 * GU}px` }}
        >
          <img src={UPARROW_ICON} alt="" width="32" height="32" />
        </Button>
        <p style={{ fontSize: "16px" }}>{no_upvotes}</p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Button
          style={{ marginBottom: `${1 * GU}px`, marginRight: `${1 * GU}px` }}
        >
          <img src={DOWNARROW_ICON} alt="" width="32" height="32" />
        </Button>
        <p style={{ fontSize: "16px" }}>{no_downvotes}</p>
      </div>
    </section>
  );
}

export default VotingButtons;
