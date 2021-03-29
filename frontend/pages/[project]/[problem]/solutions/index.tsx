import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import snapshotPckg from "@snapshot-labs/snapshot.js/";
import { GU, Split, DropDown, LoadingRing } from "@aragon/ui";

import Title from "../../../../components/Title";
import { TEST_HUB_URL } from "../../../../lib/constants";
import "../../../../styles/index.less";
import ReportSolutionIndicator from "../../../../components/ReportSolutionIndicator";
import {
  ProposalPayload,
  SnapshotData,
  VotePayload,
  VoteResult,
} from "../../../../lib/types";
import { useSpace } from "../../../../lib/hooks/spaces";
import { useCategorizedSolutions } from "../../../../lib/hooks/proposals";
import ProposalDescription from "../../../../components/DescriptionBoxes/ProposalDescription";

const SolutionsPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const problemId = router.query.problem as string;

  // STATE & EFFECT ======================================================================

  const space = useSpace(projectId);
  const [selected, setSelected] = useState(0);
  const [voteResults, setVoteResults] = useState<VoteResult[]>(null);
  const categorizedSolutions = useCategorizedSolutions(projectId, problemId);

  useEffect(() => {
    async function fetchVotes() {
      const currCategory = Object.values(categorizedSolutions)[selected];

      //Map each solution to their respective votes...
      const votes_promises: Promise<SnapshotData[]>[] = currCategory.map(
        (s) => {
          const promise = fetch(
            //get votes from Snapshot
            `${TEST_HUB_URL}/api/${space[0]}/proposal/${s.authorIpfsHash}`
          )
            .then((res) => res.json())
            .then((data: Record<string, SnapshotData>) => {
              return Object.values(data);
            });
          return promise;
        }
      );
      //... to get an array of arrays of votes.
      const votesPerSolution = await Promise.all(votes_promises);

      //Map each array of votes to an array of scores...
      const provider = snapshotPckg.utils.getProvider(space[1].network);
      const scores_promises = votesPerSolution.map(
        (votes: SnapshotData[], i) => {
          if (votes.length === 0) return []; //return empty if no votes have been cast yet.
          const problem = currCategory[i];
          const voters = votes.map((v) => v.address);
          const snapshot: string = (problem.msg
            .payload as ProposalPayload).snapshot.toString();
          const t: number = parseInt(snapshot);

          const promise: Record<string, number> = snapshotPckg.utils.getScores(
            space[0],
            space[1].strategies,
            space[1].network,
            provider,
            voters,
            t
          );
          return promise;
        }
      );
      //... to get an array of arrays of scores.
      const scoresPerSolution = await Promise.all(scores_promises);

      //add balance and scores to each vote of each problem
      const amendedVotesPerSolution = votesPerSolution.map(
        (votes: SnapshotData[], j) => {
          const scores = scoresPerSolution[j];
          //Modify the votes for each problem to contain score/balance
          const amendedVotes = Object.fromEntries(
            Object.entries(votes)
              .map((vote: any) => {
                vote[1].scores = space[1].strategies.map(
                  (_, i) => scores[i][vote[1].address] || 0
                );
                vote[1].balance = vote[1].scores.reduce(
                  (a, b: any) => a + b,
                  0
                );
                return vote;
              })
              .sort((a, b) => b[1].balance - a[1].balance)
              .filter((vote) => vote[1].balance > 0)
          );
          return amendedVotes;
        }
      );

      //compute vote results for each solution
      let voteResults: VoteResult[] = amendedVotesPerSolution.map(
        (amendedVotes, i) => {
          //if this problem has no votes, return a percentage of -1.
          if (amendedVotes.length === 0) {
            return {
              problem: currCategory[i],
              percentage: -1,
              balance: 0,
            };
          }

          function proposalBalance(): number {
            return Object.values(amendedVotes).reduce(
              (a, b: any) => a + b.balance,
              0
            ) as number;
          }
          const total = proposalBalance();

          //if this problem has no votes with balances, return a percentage of -1.
          if (total === 0) {
            return {
              problem: currCategory[i],
              percentage: -1,
              balance: 0,
            };
          }

          //return empty if no votes have been cast yet.
          const proposalPayload = currCategory[i].msg
            .payload as ProposalPayload;
          const res = proposalPayload.choices.map((_, i) =>
            Object.values(amendedVotes)
              .filter((vote) => {
                const votePayload = vote.msg.payload as VotePayload;
                return votePayload.choice === i + 1;
              })
              .reduce((a, b: any) => a + b.balance, 0)
          );

          const percentages = res.map((b: number) => (b * 100) / total);
          return {
            problem: currCategory[i],
            percentage: percentages[1],
            balance: total,
          };
        }
      );
      setVoteResults(voteResults);
    }
    if (space && categorizedSolutions) fetchVotes();
  }, [categorizedSolutions, selected]);

  // RENDERER ============================================================================

  return (
    <>
      <section
        style={{ display: "flex", width: "100%", marginTop: `${5 * GU}px` }}
      >
        <div style={{ width: "75%" }}>
          <Split
            primary={
              <Title
                title="Solutions"
                subtitle="List of solutions proposed by the community"
                bottomSpacing={0 * GU}
              />
            }
            secondary={
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: `${10 * GU}px ${2 * GU}px ${8 * GU}px`,
                }}
              >
                <DropDown
                  items={["Active", "Closed", "Pending", "All"]}
                  selected={selected}
                  onChange={setSelected}
                />
              </div>
            }
          />
          {voteResults ? (
            Object.values(categorizedSolutions)[selected].length === 0 ? (
              <div
                style={{
                  height: "400 px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "50px 0 300px 0",
                }}
              >
                <h2>There are no solutions in this category.</h2>
              </div>
            ) : (
              voteResults
                .sort((a, b) => b.balance - a.balance)
                .map((vr: VoteResult, i) => (
                  <ProposalDescription
                    key={i}
                    type={"solution"}
                    projectId={vr.problem.msg.space}
                    problemId={problemId}
                    proposal={vr.problem}
                    downvotes={vr.percentage}
                  />
                ))
            )
          ) : (
            <div
              style={{
                height: "400 px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "50px 0 300px 0",
              }}
            >
              <LoadingRing mode="half-circle" />
            </div>
          )}
        </div>
        <div style={{ width: "25%", paddingTop: `${6 * GU}px` }}>
          <ReportSolutionIndicator
            projectId={projectId}
            problemHash={problemId}
          />
        </div>
      </section>
    </>
  );
};

export default SolutionsPage;
