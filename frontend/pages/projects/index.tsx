import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  LoadingRing,
  SearchInput,
  Split,
  CardLayout,
  GU,
  Bar,
} from "@aragon/ui";

import Title from "../../components/Title";
import ProjectCard from "../../components/Cards/ProjectCard";
import { ARAGON_LOGO } from "../../lib/constants";
import "../../styles/index.less";
import { Project } from "../../lib/types";
import { useFilteredSpaces } from "../../lib/hooks/spaces";

const ProjectsPage = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const spaces: Project[] = useFilteredSpaces(value);

  // RENDERER ============================================================================

  return (
    <>
      <Split
        primary={
          <Title
            title="Projects"
            subtitle="Choose a project"
            bottomSpacing={0 * GU}
          />
        }
      />
      <Bar style={{ border: "none", marginBottom: `${4 * GU}px` }}>
        <SearchInput wide={true} value={value} onChange={setValue} />
      </Bar>
      {!spaces ? (
        <LoadingRing />
      ) : (
        <CardLayout rowHeight={33 * GU} columnWidthMin={31 * GU}>
          {spaces.map((project, index) => (
            <ProjectCard
              key={index}
              img={null}
              label={project.name}
              symbol={project.symbol}
              onOpen={() => {
                let urlObject = {
                  pathname: `/[project]/problems`,
                  query: { project: project.name.toLowerCase() },
                };
                router.push(urlObject);
              }}
            />
          ))}
        </CardLayout>
      )}
    </>
  );
};

export default ProjectsPage;
