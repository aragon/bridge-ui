import React from "react";
import { APOLLO_BRANDING_GREY } from "../lib/constants";

export default function Footer() {
  return (
    <div id="footer">
      <div className="left">
        <img src={APOLLO_BRANDING_GREY} alt="" />
      </div>
      <div className="right" style={{paddingTop:"auto", paddingBottom:"auto"}}>
        <a href="https://discord.gg/sQCxgYs" target="_blank">
          Discord
        </a>{" "}
        ·{" "}
        <a href="https://twitter.com/vocdoni" target="_blank">
          Twitter
        </a>{" "}
        ·{" "}
        <a href="https://t.me/vocdoni" target="_blank">
          Telegram
        </a>
          {" "} - Aragon {new Date().getFullYear()}
      </div>
    </div>
  );
}
