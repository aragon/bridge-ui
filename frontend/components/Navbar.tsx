import PropTypes from "prop-types";
import Link from "next/link";
import { Header, Button, GU, useLayout, Link as AragonLink } from "@aragon/ui";
import { APOLLO_BRANDING } from "../lib/constants";
import { useWallet } from "use-wallet";

export default function Navbar() {
  const { layoutWidth } = useLayout();
  const wallet = useWallet();

  function isWalletConnected() {
    return wallet.status === "connected";
  }

  return (
    <div style={{ background: "#081937", width: `${layoutWidth} px` }}>
      <Header
        style={{ padding: 2 * GU }}
        primary={
          <Link href="/" passHref>
            <AragonLink external={false}>
              <img src={APOLLO_BRANDING} />
            </AragonLink>
          </Link>
        }
        // TODO Use AddressField to display the address. (Not implemented as I can't make
        // the address field align properly)
        secondary={
          <Button
            style={{ background: "#59A0FF" }}
            mode="strong"
            wide
            label={
              isWalletConnected()
                ? "Connected: " + wallet.account
                : "Disconnected"
            }
          />
        }
      />
    </div>
  );
}
