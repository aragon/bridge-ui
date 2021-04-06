import React from "react";
import { PROBLEM_ICON, SOLUTION_ICON } from "../lib/constants";
import IndicatorCard from "./Cards/IndicatorCard";
import { useRouter } from "next/router";

type IndicatorInfo = {
  projectId: string;
  problemHash: string;
};

function ReportIndicator({ projectId, problemHash = null }: IndicatorInfo) {
  const router = useRouter();

  let cardImage: string;
  let cardText: string;
  let cardSubTitle: string;
  let cardActionText: string;
  let pathName: string;
  let query: any;
  let buttonMode: string;
  if (problemHash === null) {
    cardImage = PROBLEM_ICON;
    cardText = "Report a problem";
    cardSubTitle="... and get rewarded";
    cardActionText = "Create new problem";
    pathName = "/[projectId]/proposal";
    query = { projectId: projectId };
    buttonMode = "negative";
  } else {
    cardImage = SOLUTION_ICON;
    cardText = "Report a solution";
    cardSubTitle="... and get rewarded";
    cardActionText = "Create new solution";
    pathName = "/[projectId]/[problemId]/proposal";
    query = { projectId: projectId, problemId: problemHash };
    buttonMode = "strong";
  }
  // RENDERER ============================================================================

  return (
    <div
      className="sticky"
    >
      <IndicatorCard 
        ilustration={cardImage}
        text={cardText}
        subText={cardSubTitle}
        buttonAction={() => {
          let urlObject = {
            pathname: pathName,
            query: query,
          };
          router.push(urlObject);
        }}
        buttonMode={buttonMode}
        buttonText={cardActionText}
      />
    </div>
  );
}

export default ReportIndicator;
