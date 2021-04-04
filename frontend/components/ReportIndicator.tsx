import React from "react";
import Link from "next/link";
import { Box, GU, Button, EmptyStateCard } from "@aragon/ui";
import { PROBLEM_ICON, SOLUTION_ICON } from "../lib/constants";

type IndicatorInfo = {
  projectId: string;
  problemHash: string;
};

function ReportIndicator({ projectId, problemHash = null }: IndicatorInfo) {
  let cardImage: string;
  let cardText: string;
  let cardActionText: string;
  let pathName: string;
  let query: any;
  if (problemHash === null) {
    cardImage = PROBLEM_ICON;
    cardText = "Report a problem";
    cardActionText = "Create new problem";
    pathName = "/[projectId]/proposal";
    query = { projectId: projectId };
  } else {
    cardImage = SOLUTION_ICON;
    cardText = "Report a solution";
    cardActionText = "Create new solution";
    pathName = "/[projectId]/[problemId]/proposal";
    query = { projectId: projectId, problemId: problemHash };
  }
  // RENDERER ============================================================================

  return (
    <EmptyStateCard
      illustration={<img src={cardImage} alt="" />}
      text={cardText}
      action={
        <Link
          href={{
            pathname: pathName,
            query: query,
          }}
          passHref
        >
          <Button mode="negative" external={false} label={cardActionText} />
        </Link>
      }
    />
  );
}

export default ReportIndicator;
