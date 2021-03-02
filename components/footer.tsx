import React from "react";

export default function Footer() {
  return (
    <div id="footer">
      <div className="left">
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
      </div>
      <div className="right">Aragon {new Date().getFullYear()}</div>
    </div>
  );
}
