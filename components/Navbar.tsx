import PropTypes from 'prop-types'
import Link from "next/link";
import { Header, Button, GU, useLayout } from "@aragon/ui";
import { APOLLO_BRANDING } from "../lib/constants";

export default function Navbar({connected, address}) {
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
          <Button
            style={{
              background: "#59A0FF",
            }}
            mode="strong"
            wide
            label={ (connected ? ("Connected: " +  address) : "Disconnected")}
          />
          // <div>
            // {/* <Button
            //   style={{ marginRight: 2 * GU }}
            //   href="/"
            //   external={false}
            //   label="Projects"
            // />
            // <Button
            //   style={{ marginRight: 2 * GU }}
            //   href="/"
            //   external={false}
            //   label="Docs"
            // /> */}
          // {/* </div> */}
        }
      />
    </div>
  );
}

Navbar.propTypes = {
  connected: PropTypes.bool.isRequired,
  address: PropTypes.string,
}