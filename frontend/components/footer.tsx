import React from "react";
import { APOLLO_BRANDING_GREY } from "../lib/constants";

export default function Footer() {
  return (
    <div position="absolute" widht="max" left="0 px" right="0 px" bottom="0 px">
      <div className="left">
        <img src={APOLLO_BRANDING_GREY} alt="" />
      </div>
      <div
        className="right"
        style={{ paddingTop: "auto", paddingBottom: "auto" }}
      >
        <a href="https://discord.gg/7VvnTy4U" target="_blank">
          Discord
        </a>{" "}
        ·{" "}
        <a href="https://twitter.com/aragonproject" target="_blank">
          Twitter
        </a>{" "}
        ·{" "}
        <a
          href="https://www.youtube.com/channel/UCODiU_-FWhr4SVOoBlm-qaQ"
          target="_blank"
        >
          Youtube
        </a>{" "}
        - Aragon {new Date().getFullYear()}
      </div>
    </div>
  );
}
