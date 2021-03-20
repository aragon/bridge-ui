import React, { useState } from "react";
import { useRouter } from "next/router";
import { LoadingRing, SearchInput, Split, CardLayout, GU } from "@aragon/ui";

import Title from "../../components/Title";
import ProjectCard from "../../components/Cards/ProjectCard";
import { ARAGON_LOGO } from "../../lib/constants";
import "../../styles/index.less";
import { Project } from "../../lib/types";
import { useSpaces } from "../../lib/hooks/spaces";

const ProjectsPage = () => {
  const spaces: Project[] = useSpaces();
  const router = useRouter();
  // const [value, setValue] = useState("");

  // RENDERER ============================================================================

  if (!spaces) {
    return <LoadingRing />;
  }

  return (
    <>
      <Split
        primary={<Title title="Projects" subtitle="Choose a project" />}
        secondary={
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: `${10 * GU}px ${2 * GU}px ${7 * GU}px`,
            }}
          >
            {/* <Button
              style={{ background: "#59A0FF" }}
              mode="strong"
              label="Add Project"
            /> */}
          </div>
        }
      />
      {/* <div>
        <SearchInput value={value} onChange={setValue} />
      </div> */}
      <CardLayout rowHeight={33 * GU} columnWidthMin={31 * GU}>
        {spaces.map((project, index) => (
          <ProjectCard
            key={index}
            img={ARAGON_LOGO}
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
    </>
  );
};

export default ProjectsPage;
