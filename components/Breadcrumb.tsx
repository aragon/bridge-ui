import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

function Breadcrumbs() {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/" + linkPath.slice(0, i + 1).join("/"),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <Fragment>
      <a href="/">HOME</a>
      <>
        {breadcrumbs.map((breadcrumb, i) => {
          return (
            <Link key={i} href={breadcrumb.href}>
              <a> / {breadcrumb.breadcrumb}</a>
            </Link>
          );
        })}
      </>
    </Fragment>
  );
}

export default Breadcrumbs;
