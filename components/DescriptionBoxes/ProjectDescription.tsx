import React from "react";
import PropTypes from "prop-types";
import { Card, GU, textStyle, useTheme } from "@aragon/ui";

function ProjectDescription({ illustration, subtitle, title }) {
  const theme = useTheme();
  return (
    <Card
      width="100%"
      height="auto"
      style={{
        marginTop: `${4 * GU}px`,
        background: "#F4F4F4",
        borderRadious: `10px`,
      }}
    >
      <section
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          padding: `${2 * GU}px ${2 * GU}px ${2 * GU}px  ${2 * GU}px`,
          borderRadius: "10px",
        }}
      >
        <div style={{ width: `${19 * GU}px`, textAlign: "center" }}>
          <img
            style={{
              display: "block",
            }}
            src={illustration}
            alt=""
            width="110"
          />
        </div>
        <div>
          <h1
            style={{
              fontSize: "25px",
              fontWeight: "bold",
              marginBottom: `${0.5 * GU}px`,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: "16px",
                color: `${theme.surfaceContentSecondary}`,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </section>
    </Card>
  );
}

ProjectDescription.propTypes = {
  illustration: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  title: PropTypes.node.isRequired,
};

export default ProjectDescription;
