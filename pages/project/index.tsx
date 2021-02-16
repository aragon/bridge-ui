import React, { Fragment } from "react";
import { GU, CardLayout } from "@aragon/ui";
import { useRouter, withRouter } from "next/router";

import Title from "../../components/Title";
import ProductCard from "../../components/Cards/ProductCard";
import { ARAGON_LOGO, APOLLO_LOGO } from "../../lib/constants";
import "../../styles/index.less";
import Header from "../../components/Header";
import Breadcrumbs from "../../components/Breadcrumb";

const PRODUCTS = [
  {
    label: "Apollo",
    img: APOLLO_LOGO,
    url: "",
    no_problems: 42,
    no_solutions: 42,
  },
  {
    label: "Govern",
    img: ARAGON_LOGO,
    url: "",
    no_problems: 42,
    no_solutions: 42,
  },
  {
    label: "Protocol",
    img: ARAGON_LOGO,
    url: "",
    no_problems: 42,
    no_solutions: 42,
  },
  {
    label: "Connect",
    img: ARAGON_LOGO,
    url: "",
    no_problems: 42,
    no_solutions: 42,
  },
];

const ProjectPage = (props) => {
  const router = useRouter();
  return (
    <Fragment>
      <Breadcrumbs/>
      <Header
        illustration={ARAGON_LOGO}
        title="Aragon"
        subtitle="Aragon gives internet communities unprecedented power to organize around shared values and resources."
      />
      <Title
        title="Products"
        subtitle="All products inside the Aragon ecosystem"
        topSpacing={7 * GU}
        bottomSpacing={5 * GU}
      />
      <CardLayout rowHeight={33 * GU} columnWidthMin={31 * GU}>
        {PRODUCTS.map(
          ({ img, label, url, no_problems, no_solutions }, index) => (
            <ProductCard
              key={index}
              img={img}
              label={label}
              no_prob={no_problems}
              no_sol={no_solutions}
              onOpen={() => {
                router.push("/problems");
              }}
            />
          )
        )}
      </CardLayout>
    </Fragment>
  );
};

export default withRouter(ProjectPage);
