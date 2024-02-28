import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { FC, ReactNode, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

require("@solana/wallet-adapter-react-ui/styles.css");

export const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

  const wallets = useMemo(() => {
    return [];
  }, []);

  const onError = useCallback((error: WalletError) => {
    console.error("Wallet error: " + error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint as string}>
      <WalletProvider wallets={[]} onError={onError}>
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};
