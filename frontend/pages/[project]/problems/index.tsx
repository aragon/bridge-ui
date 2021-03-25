import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import snapshotPckg from "@snapshot-labs/snapshot.js/";
import { GU, Split, DropDown, LoadingRing } from "@aragon/ui";

import Title from "../../../components/Title";
import { BACKEND_URL, TEST_HUB_URL } from "../../../lib/constants";
import "../../../styles/index.less";
import ProblemDescription from "../../../components/DescriptionBoxes/ProblemDescription";
import ReportProblemIndicator from "../../../components/ReportProblemIndiactor";
import "../../../lib/types";
import {
  ProposalCategories,
  ProposalPayload,
  SnapshotData,
  VotePayload,
  VoteResult,
} from "../../../lib/types";
import { useCategorizedProblems } from "../../../lib/hooks/proposals";
import { useSpace } from "../../../lib/hooks/spaces";

const ProblemsPage = () => {
  const router = useRouter();
  const projectId = router.query.project;

  // STATE & EFFECT ======================================================================

  const space = useSpace(projectId);
  const [selected, setSelected] = useState(0);
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
  const [amendedVotes, setAmendedVotes] = useState(null);
  const categorizedProblems = useCategorizedProblems(projectId);

  useEffect(() => {
    async function fetchVotes() {
      console.log("fetching votes");
      let vote_results: VoteResult[] = [];
      const currCategory = Object.values(categorizedProblems)[selected];

      //Map each problem to get the respective votes.
      const votes_promises: Promise<SnapshotData[]>[] = currCategory.map(
        (p) => {
          const promise = fetch(
            `${TEST_HUB_URL}/api/aragon/proposal/${p.authorIpfsHash}`
          )
            .then((res) => res.json())
            .then((data: SnapshotData[]) => {
              console.log(data);
              return data;
            });
          return promise;
        }
      );
      //res is now an array of arrays of votes.
      const votesPerProblem = await Promise.all(votes_promises);

      //Map each array of votes to an array of scores.
      const provider = snapshotPckg.utils.getProvider(space[1].network);
      const scores_promises = votesPerProblem.map(
        (votes: SnapshotData[], i) => {
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
      //res is now an array of arrays of scores.
      const scoresPerProblem = await Promise.all(scores_promises);

      //add balance and scores to each vote of each problem
      const amendedVotesPerProblem = votesPerProblem.map(
        (votes: SnapshotData[], j) => {
          const scores = scoresPerProblem[j];
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

      //compute vote Results.
    }
    if (categorizedProblems) fetchVotes();
  }, [categorizedProblems, selected]);

  // Pull all the votes related to each problem from Snapshot.
  // useEffect(() => {
  //   async function fetchVotes() {
  //     console.log("fetching votes");
  //     let vote_results: VoteResult[] = [];
  //     const currCategory = Object.values(categorizedProblems)[selected];
  //     for (let proposal of currCategory) {
  //       const res = await fetch(
  //         `https://testnet.snapshot.page/api/aragon/proposal/${proposal.authorIpfsHash}`
  //       );
  //       if (!res.ok) {
  //         throw Error(res.statusText);
  //       }
  //       const data = await res.json();
  //       const votes: SnapshotData[] = Object.values(data);

  //       //compute voting results.
  //       // TODO compute results w.r.t. to a strategy. Currently, each vote is weighted
  //       // equally, idenpendetly of any erc-20 tokens.
  //       let percentage_downvotes = -1;
  //       if (votes.length) {
  //         function reducer(acc: number, curr: SnapshotData) {
  //           const vote = curr.msg.payload as VotePayload;
  //           return acc + vote.choice - 1;
  //         }
  //         const no_upvotes = votes.reduce(reducer, 0);
  //         percentage_downvotes = (no_upvotes / votes.length) * 100;
  //       }

  //       const result: VoteResult = {
  //         problem: proposal,
  //         percentage: percentage_downvotes,
  //         balance: 100,
  //       };
  //       vote_results.push(result);
  //     }
  //     console.log("all votes fetched");
  //     setVoteResults(vote_results);
  //   }
  //   if (categorizedProblems) fetchVotes();
  // }, [categorizedProblems, selected]);

  // RENDERER ============================================================================

  return (
    <section
      style={{ display: "flex", width: "100%", marginTop: `${5 * GU}px` }}
    >
      <div style={{ width: "75%" }}>
        <Split
          primary={
            <Title
              title="Problems"
              subtitle="List of problems reported by the community"
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
        {Object.values(categorizedProblems)[selected].map(
          (p: SnapshotData, i) => (
            <ProblemDescription key={i} problem={p} downvotes={0.5} />
          )
        )}
      </div>
      <div style={{ width: "25%", paddingTop: `${6 * GU}px` }}>
        <ReportProblemIndicator projectName={projectId} />
      </div>
    </section>
  );
};

// return (
//     <>
//       {/* <Breadcrumbs /> */}
//       <section
//         style={{ display: "flex", width: "100%", marginTop: `${5 * GU}px` }}
//       >
//         <div style={{ width: "75%" }}>
//           <Split
//             primary={
//               <Title
//                 title="Problems"
//                 subtitle="List of problems reported by the community"
//                 bottomSpacing={0 * GU}
//               />
//             }
//             secondary={
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-end",
//                   justifyContent: "center",
//                   padding: `${10 * GU}px ${2 * GU}px ${8 * GU}px`,
//                 }}
//               >
//                 <DropDown
//                   items={["Active", "Closed", "Pending", "All"]}
//                   selected={selected}
//                   onChange={setSelected}
//                 />
//               </div>
//             }
//           />
//           {done ? (
//             voteResults.length === 0 ? (
//               <div
//                 style={{
//                   height: "400 px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   margin: "50px 0 300px 0",
//                 }}
//               >
//                 <h2>There are no problems in this category.</h2>
//               </div>
//             ) : (
//               voteResults
//                 .sort((a, b) => a.percentage - b.percentage)
//                 .map((v: VoteResult, i) => (
//                   <ProblemDescription
//                     key={i}
//                     problem={v.problem}
//                     downvotes={v.percentage}
//                   />
//                 ))
//             )
//           ) : (
//             <div
//               style={{
//                 height: "400 px",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 margin: "50px 0 300px 0",
//               }}
//             >
//               <LoadingRing mode="half-circle" />
//             </div>
//           )}
//         </div>
//         <div style={{ width: "25%", paddingTop: `${6 * GU}px` }}>
//           <ReportProblemIndicator projectName={project} />
//         </div>
//       </section>
//     </>
//   );
// };

export default ProblemsPage;
