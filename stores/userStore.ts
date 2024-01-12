import { AnchorProvider, Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { create } from "zustand";

type Store = {
  loggedIn: boolean;
  loginType: string;
  username: string;
  solana_wallet_address: string;
  connection: Connection | null;
  wallet: Wallet | null;
  current_provider: AnchorProvider | null;
  ip_address: string;
  userProfilePic: string;
  setLogin: (
    status: boolean,
    loginType: string,
    username: string,
    solana_wallet_address: string,
    connection: Connection,
    wallet: Wallet,
    current_provider: AnchorProvider,
    ip_address: string
  ) => void;
};

export const userStore = create<Store>((set) => ({
  loggedIn: false,
  loginType: "",
  username: "",
  solana_wallet_address: "",
  connection: null,
  wallet: null,
  current_provider: null,
  ip_address: "",
  userProfilePic:
    "https://shdw-drive.genesysgo.net/5jHWA7UVajMawLH2wVCZdp3U4u42XsF8rSa1DcEQui72/profilePicWhite.svg",
  setLogin: (
    status,
    loginType,
    username,
    solana_wallet_address,
    connection,
    wallet,
    current_provider,
    ip_address
  ) =>
    set({
      loggedIn: status,
      loginType: loginType,
      username: username,
      solana_wallet_address: solana_wallet_address,
      connection: connection,
      wallet: wallet,
      current_provider: current_provider,
      ip_address: ip_address,
    }),
}));

export default userStore;
