import { Solana } from "@raindrop-studios/events-client";
import { AnchorProvider, Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";

export async function createTournament(
  tournamentName: string,
  participantLimit: number,
  wallet: Wallet,
  connection: Connection,
  entryFee: Solana.Rpc.Events.EntryFee,
  rewardMint: string,
  rewardAmount: number
): Promise<string> {
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the tournament authority
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    // Create a tournament
    const tournamentPubkey = await authority.createTournament(
      tournamentName,
      participantLimit,
      entryFee,
      null
    );

    if (!tournamentPubkey) {
      throw new Error("Tournament unavailable");
    }

    console.log(
      "Tournament created successfully with pubkey: ",
      tournamentPubkey
    );

    // Add entry fee as a reward
    await authority.addEntryFeeAsReward(tournamentPubkey);

    console.log("Entry fee added as reward successfully");

    // Add an additional reward
    await authority.addReward(
      tournamentPubkey,
      rewardMint,
      rewardAmount.toString()
    );

    console.log("Additional reward added successfully");

    return tournamentPubkey;
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw error;
  }
}

export async function enterTournament(
  tournamentPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<void> {
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the participant client
  const participant = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    // Enter the tournament
    await participant.enterTournament(tournamentPubkey);
    console.log("Successfully entered the tournament");
  } catch (error) {
    console.error("Error entering tournament:", error);
    throw error;
  }
}

export async function startTournament(
  tournamentPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<void> {
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the tournament authority
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    // Start the tournament
    await authority.startTournament(tournamentPubkey);
    console.log("Tournament started successfully");
  } catch (error) {
    console.error("Error starting tournament:", error);
    throw error;
  }
}
