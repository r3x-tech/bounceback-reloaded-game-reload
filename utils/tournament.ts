import { Solana } from "@raindrop-studios/events-client";
import { AnchorProvider, Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";

export async function createTournament(
  tournamentName: string,
  participantLimit: number,
  wallet: Wallet,
  connection: Connection,
  entryFee: Solana.Rpc.Events.EntryFee,
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
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
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

export async function getMatch(
  matchPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<any> {
  // Replace any with the appropriate type
  const provider = new AnchorProvider(connection, wallet, {});
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const matchData = await authority.getMatch(matchPubkey);
    console.log("Match Data:", matchData);
    return matchData;
  } catch (error) {
    console.error("Error getting match data:", error);
    throw error;
  }
}

export async function getMatchesByRound(
  tournamentPubkey: string,
  roundIndex: number,
  finalized: boolean,
  wallet: Wallet,
  connection: Connection
): Promise<any[]> {
  // Replace any[] with the appropriate type
  const provider = new AnchorProvider(connection, wallet, {});
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const matches = await authority.getMatchesByRound(
      tournamentPubkey,
      roundIndex,
      finalized
    );
    console.log("Matches:", matches);
    return matches;
  } catch (error) {
    console.error("Error getting matches by round:", error);
    throw error;
  }
}

export async function getMatchParticipants(
  tournamentPubkey: string,
  matchPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<string[]> {
  const provider = new AnchorProvider(connection, wallet, {});
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const participants = await authority.getMatchParticipants(
      tournamentPubkey,
      matchPubkey
    );
    console.log("Participants:", participants);
    return participants;
  } catch (error) {
    console.error("Error getting match participants:", error);
    throw error;
  }
}

export async function getParticipantsForRound(
  tournamentPubkey: string,
  roundIndex: number,
  wallet: Wallet,
  connection: Connection
): Promise<string[]> {
  const provider = new AnchorProvider(connection, wallet, {});
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const participants = await authority.getParticipantsForRound(
      tournamentPubkey,
      roundIndex
    );
    console.log("Participants for round:", participants);
    return participants;
  } catch (error) {
    console.error("Error getting participants for round:", error);
    throw error;
  }
}

export async function getTournamentStandings(
  tournamentPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<Map<string, number>> {
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the tournament authority
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const standings = await authority.getStandings(tournamentPubkey);
    console.log("Tournament standings retrieved successfully");
    return standings;
  } catch (error) {
    console.error("Error retrieving tournament standings:", error);
    throw error;
  }
}

export async function getTournamentDetails(
  tournamentPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<any> {
  // Replace 'any' with the appropriate type for tournament details
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the tournament authority
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const tournamentData = await authority.getTournament(tournamentPubkey);
    console.log("Tournament details retrieved successfully");
    return tournamentData;
  } catch (error) {
    console.error("Error retrieving tournament details:", error);
    throw error;
  }
}
