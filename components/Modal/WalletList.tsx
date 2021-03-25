import { useRouter } from "next/router";
import styled from "styled-components";
import { useWallet } from "use-wallet";

import { Modal } from ".";
import { useIsMobile } from "../../lib/hooks/useWindowSize";
import { WALLETS } from "../../lib/wallets";
import { ActionTypes, useModal } from "./context";

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const ModalTitle = styled.div`
    display: flex;
    border-bottom: 1px solid #dfe3e8;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-top: 10px;
    padding-left: 16px;
    font-family: Overpass;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: #637381;
`;

const Body = styled.div`
    height: 100%;
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    @media ${({ theme }) => theme.screens.mobileL} {
        justify-content: center;
    }
`;

const WalletOption = styled.div`
    width: 100%;
    height: 100px;
    border-radius: 8px;
    text-align: center;
    white-space: normal;
    box-shadow: 0px 2px 4px rgba(180, 188, 202, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    @media ${({ theme }) => theme.screens.tablet} {
        margin-top: 10px;
    }
`;

const WalletName = styled.h4`
    display: flex;
    margin-top: 10px;
    color: #25314d;
    font-family: Overpass;
    font-weight: 300;
    font-size: 22px;
`;

const WalletLogo = styled.img`
    width: 40px;
    height: 40px;
    display: flex;
    margin-top: 10px;
`;

const OptionContainer = styled.div`
    height: 104px;
    width: 204px;
    cursor: pointer;
    margin-top: 10px;
`;

const ExternalLinkOption = styled.a`
    display: flex;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    font-family: Overpass;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: #637381;
`;

const DontHaveAccount = styled.h5`
    font-family: Overpass;
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    color: #3361eb;
    display: flex;
    margin: auto;
    margin-bottom: 10px;
    cursor: pointer;
`;

const HARDWARE_WALLETS_METAMASK_ARTICLE =
    "https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet";

export const WalletList = () => {
    const { connect, error } = useWallet();
    const { push, pathname } = useRouter();
    const { state, dispatch } = useModal();
    const isMobile = useIsMobile();

    const inLanding = pathname === "/";

    const closeModal = () => {
        dispatch({
            type: ActionTypes.CLOSE,
        });
    };

    const handleConnection = async (wallet) => {
        // @TODO: Remove this when ledger and trezor are implemented in useWallet
        if (wallet === "ledger" || wallet === "trezor") return;
        try {
            await connect(wallet);
            if (!error && inLanding) push("/dashboard");
            closeModal();
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Modal open={state.walletList.open} height={530} width={452}>
            <ModalContainer>
                <ModalTitle>USE ACCOUNT FROM</ModalTitle>
                <Body>
                    {Object.keys(WALLETS).map((wallet) => {
                        const { connector, name } = WALLETS[wallet];
                        const Option = () => (
                            <WalletOption
                                onClick={() => handleConnection(connector)}
                            >
                                <WalletLogo
                                    src={`/media/wallets/${connector}.svg`}
                                />
                                <WalletName>{name}</WalletName>
                            </WalletOption>
                        );
                        return (
                            <OptionContainer key={"wallet_" + wallet}>
                                {/* @TODO: Remove this when ledger and trezor are implemented in useWallet */}
                                {name === "ledger" || name === "trezor" ? (
                                    <ExternalLinkOption
                                        rel="noreferrer noopener"
                                        target="_blank"
                                        href={HARDWARE_WALLETS_METAMASK_ARTICLE}
                                    >
                                        <Option />
                                    </ExternalLinkOption>
                                ) : (
                                    <Option />
                                )}
                            </OptionContainer>
                        );
                    })}
                </Body>
                {isMobile ? null : (
                    <DontHaveAccount>
                        Don't have an Ethereum account?
                    </DontHaveAccount>
                )}
            </ModalContainer>
        </Modal>
    );
};
