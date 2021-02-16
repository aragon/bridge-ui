//TODO: Rename this file Navbar.tsx/*  */
import Link from "next/link";
import { Header, Button, GU, useLayout } from "@aragon/ui";
import { APOLLO_BRANDING } from "../lib/constants";

export function Navbar() {
  const { layoutWidth } = useLayout();
  return (
    <div style={{ background: "#081937", width: `${layoutWidth} px` }}>
      <Header
        style={{ padding: 2 * GU }}
        primary={
          //TODO Make this change mouse on hover.
          <Link href="/">
            <img src={APOLLO_BRANDING} />
          </Link>
        }
        secondary={
          <>
            <Button
              style={{ marginRight: 2 * GU }}
              href="/"
              external={false}
              label="Projects"
            />
            <Button
              style={{ marginRight: 2 * GU }}
              href="/"
              external={false}
              label="Docs"
            />
            <Button
              style={{
                background: "#59A0FF",
              }}
              mode="strong"
              label="Add tokens"
            />
          </>
        }
      />
    </div>
  );
}
