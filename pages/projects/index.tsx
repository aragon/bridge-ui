import React, { Fragment, useState, useEffect } from "react";
import { Button, Split, CardLayout, GU } from "@aragon/ui";
import { useRouter, withRouter } from "next/router";

import Title from "../../components/Title";
import ProjectCard from "../../components/Cards/ProjectCard";
import { ARAGON_LOGO } from "../../lib/constants";
import "../../styles/index.less";

const ProjectsPage = ({ connectionSetter }) => {
  const router = useRouter();

  // STATE & EFFECT ======================================================================

  const [error, setError] = useState(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(`https://testnet.snapshot.page/api/spaces`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((data) => Object.values(data).slice(13, 20))
      .then((data: Project[]) => setProjects(data)) //cast data to Project interface.
      .catch((reason) => {
        setError(reason);
      });
  }, []);

  // RENDERER ============================================================================

  return (
    <Fragment>
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
            <Button
              style={{ background: "#59A0FF" }}
              mode="strong"
              label="Add Project"
            />
          </div>
        }
      />
      {error ? (
        <div style={{ marginTop: `${5 * GU}px`, textAlign: "center" }}>
          <h2>
            Unfortunately, there was an error when retrieving this problem
            proposal.
          </h2>
        </div>
      ) : (
        <CardLayout rowHeight={33 * GU} columnWidthMin={31 * GU}>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              img={ARAGON_LOGO}
              label={project.name}
              symbol={project.symbol}
              onOpen={() => {
                let urlObject = {
                  pathname: `/[project]/problems`,
                  query: { project: project.name },
                };
                router.push(urlObject);
              }}
            />
          ))}
        </CardLayout>
      )}
    </Fragment>
  );
};

export default ProjectsPage;

// TYPES =================================================================================

export interface Project {
  name: string;
  network: string;
  symbol: string;
  strategies: Strategy[];
  members: string[];
  filters: Filters;
}

export interface Filters {
  defaultTab: string;
  minScore: number;
}

export interface Strategy {
  name: string;
  params: Params;
}

export interface Params {
  address: string;
  symbol: string;
  decimals: number;
}
