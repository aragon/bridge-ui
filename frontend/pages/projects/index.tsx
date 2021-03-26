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
import "../../styles/index.less";
import { Project } from "../../lib/types";
import { useFilteredSpaces } from "../../lib/hooks/spaces";

const ProjectsPage = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const spaces = useFilteredSpaces(value);

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
      ) : (
        <CardLayout rowHeight={33 * GU} columnWidthMin={31 * GU}>
          {spaces.map(([id, project], index) => (
            <ProjectCard
              key={index}
              img={null}
              label={project.name}
              symbol={project.symbol}
              onOpen={() => {
                let urlObject = {
                  pathname: `/[project]/problems`,
                  query: { project: id },
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
