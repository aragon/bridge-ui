import React from "react";
import { Card, GU } from "@aragon/ui";

function ProjectCard({ onOpen, label, img, symbol }) {
  const handleClick = React.useCallback(() => {
    onOpen(label);
  }, [onOpen]);

  return (
    <Card onClick={handleClick}>
      <img src={img} alt="" width="160" height="145" />
      <p style={{ fontSize: "20px", marginTop: `${2 * GU}px` }}>{label}</p>
      <p style={{ fontSize: "15px", marginTop: `${1 * GU}px` }}>{symbol}</p>
    </Card>
  );
}

export default ProjectCard;
