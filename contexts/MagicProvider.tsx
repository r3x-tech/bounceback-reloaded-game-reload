import { Magic as MagicBase } from "magic-sdk";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SolanaExtension } from "@magic-ext/solana";
import { OAuthExtension } from "@magic-ext/oauth";
import { AuthExtension } from "@magic-ext/auth";
import { Connection } from "@solana/web3.js";

export type Magic = MagicBase<
  AuthExtension & OAuthExtension[] & SolanaExtension
>;

type MagicContextType = {
  magic: Magic | null;
  connection: Connection | null;
  signMagicTransaction: any | null;
  signAllMagicTransactions: any | null;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  connection: null,
  signMagicTransaction: null,
  signAllMagicTransactions: null,
});

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [signMagicTransaction, setSignMagicTransaction] = useState<any>(null);
  const [signAllMagicTransactions, setSignAllMagicTransactions] =
    useState<any>(null);

  const rpcURL = process.env.NEXT_PUBLIC_ENDPOINT!;

  useEffect(() => {
    if (rpcURL && process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      try {
        const pk = process.env.NEXT_PUBLIC_MAGIC_API_KEY;
        const magicInstance = new MagicBase(pk, {
          extensions: [
            new OAuthExtension(),
            new AuthExtension(),
            new SolanaExtension({
              rpcUrl: rpcURL,
            }),
          ],
        });

        const connectionInstance = new Connection(rpcURL);
        setMagic(magicInstance);
        setConnection(connectionInstance);
        setSignMagicTransaction(() => magicInstance.solana.signTransaction);
        setSignAllMagicTransactions(() => magicInstance.solana.signTransaction);
      } catch (error) {
        console.error("Error initializing Magic or Connection:", error);
      }
    }
  }, [rpcURL]);

  const value = useMemo(() => {
    return {
      magic,
      connection,
      signMagicTransaction,
      signAllMagicTransactions,
    };
  }, [magic, connection, signMagicTransaction, signAllMagicTransactions]);

  return (
    <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
  );
};

export const useMagic = () => useContext<MagicContextType>(MagicContext);

export default MagicProvider;
