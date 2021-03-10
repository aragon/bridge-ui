import React, { Fragment } from "react";
import { useRouter, withRouter } from "next/router";
import { GU } from "@aragon/ui";

import Title from "../../../../components/Title";
import "../../../../styles/index.less";
import Header from "../../../../components/Header";
import Breadcrumbs from "../../../../components/Breadcrumb";
import SolutionDescription from "../../../../components/DescriptionBoxes/SolutionDescription";
import ReportSolutionIndicator from "../../../../components/ReportSolutionIndicator";

const SOLUTIONS = [
  {
    project: {
      project: "Aragon",
      product: "Apollo",
      title: "Not enough money",
      description: "Switzerland is expensive af.",
      reporter: "Me",
      no_upvotes: 42,
      no_downvotes: 42,
    },
    title: "Better Budget",
    description:
      "Getting a special delivery from Sprüngli every day might drive living costs up unnecessarily.",
    reporter: "Me",
    no_upvotes: 42,
    no_downvotes: 42,
  },
  {
    project: {
      project: "Aragon",
      product: "Apollo",
      title: "Not enough money",
      description: "Switzerland is expensive af.",
      reporter: "Me",
      no_upvotes: 42,
      no_downvotes: 42,
    },
    title: "Get a Promotion",
    description: "Promotion => more $$$",
    reporter: "Me",
    no_upvotes: 42,
    no_downvotes: 42,
  },
];

const SolutionsPage = () => {
  const router = useRouter();
  const { project, problem } = router.query;

  return (
    <Fragment>
      <Breadcrumbs />
      <Header title={project} subtitle={`Problem: ${problem}`} />
      <Title
        title="Solutions"
        subtitle="List of solutions reported by the community"
        topSpacing={7 * GU}
        bottomSpacing={5 * GU}
      />
      <section
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        <div style={{ width: "75%" }}>{SOLUTIONS.map(dataToCards)}</div>
        <div style={{ width: "25%" }}>
          <ReportSolutionIndicator
            projectName={project}
            problemHash={problem}
          />
        </div>
      </section>
    </Fragment>
  );
};

export default withRouter(SolutionsPage);

function dataToCards(
  { title, description, reporter, no_upvotes, no_downvotes },
  index
) {
  return (
    <SolutionDescription
      key={index}
      title={title}
      description={description}
      reporter={reporter}
      no_upvotes={no_upvotes}
      no_downvotes={no_downvotes}
    />
  );
}
