import React, { FC, useState } from "react";
import { NextComponentType, NextPageContext } from "next";
import { AppInitialProps } from "next/app";
import NextHead from "next/head";
import { Router } from "next/router";
import { UseWalletProvider } from "use-wallet";
import { EthNetworkID } from "dvote-js";
import { Main, Layout } from "@aragon/ui";
import { UsePoolProvider, UseProcessProvider } from '@vocdoni/react-hooks'
import { UseTokenProvider } from '../lib/hooks/tokens'

import Footer from "../components/footer";
import Navbar from "../components/Navbar";
import "../styles/index.less";
import { FAVICON } from "../lib/constants";

type NextAppProps = AppInitialProps & {
  Component: NextComponentType<NextPageContext, any, any>;
  router: Router;
};

const BridgeApp: FC<NextAppProps> = ({ Component, pageProps }) => {
  const chainId = parseInt(process.env.ETH_CHAIN_ID);
  const bootnodeUri = process.env.BOOTNODES_URL;
  const networkId = process.env.ETH_NETWORK_ID as EthNetworkID;
  const [ connected, setConnectionState] = useState(false);
  const [ address, setAddress] = useState("");

  return (
    <UsePoolProvider bootnodeUri={bootnodeUri} networkId={networkId}>
      <UseTokenProvider>
        <UseProcessProvider>
          <UseWalletProvider chainId={chainId} connectors={{}}>
            <NextHead>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <link rel="icon" href={FAVICON}></link>
              <title>Apollo</title>
            </NextHead>
            <Main layout={false}>
              <Navbar connected={connected} address={address} />
              <Layout>
                <div>
                  <Component
                    connectionSetter={setConnectionState}
                    addressSetter={setAddress}
                  />
                </div>
              </Layout>
              <Footer />
            </Main>
          </UseWalletProvider>
        </UseProcessProvider>
      </UseTokenProvider>
    </UsePoolProvider>
  );
};

export default BridgeApp;
