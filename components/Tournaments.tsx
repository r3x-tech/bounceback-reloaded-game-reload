import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  List,
  VStack,
  Button,
  Flex,
  Tooltip,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Tournament, getTournamentsByGameName } from "../utils/tournament";
import theme from "@/styles/theme";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Link from "next/link";
import userStore from "@/stores/userStore";
import { IoMdTrophy } from "react-icons/io";
import { MdArrowBack, MdPerson } from "react-icons/md";
import { FaCopy, FaShare } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { createTournament } from "@/utils/tournament";
import { BN, AnchorProvider } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { useLoadingStore } from "@/stores/useLoadingStore";

dayjs.extend(duration);

export function Tournaments() {
  const {
    username,
    loggedIn,
    loginType,
    solana_wallet_address,
    currentConnection,
    currentWallet,
    ip_address,
    userProfilePic,
  } = userStore();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [creatingTournament, setCreatingTournament] = useState<boolean>(false);
  const router = useRouter();

  const { handleSubmit, control, formState } = useForm<FormData>();
  const { errors } = formState;

  const handleCreateTournament = async (data: FormData) => {
    console.log("ran handleCreateTournament");
    if (!loggedIn || solana_wallet_address.trim() == "") {
      toast.error("Login to create a tournament");
      return;
    }

    setCreatingTournament(true);

    // Assuming data is the object containing your form values
    const parsedData = {
      ...data,
      tournamentSize: data.tournamentSize || 0,
      tournamentEntryFee: data.tournamentEntryFee || 0,
      tournamentRewardAmount: data.tournamentRewardAmount || 0,
    };

    // Now check if any field is empty or zero
    if (
      !parsedData.tournamentName ||
      parsedData.tournamentSize === undefined ||
      parsedData.tournamentEntryFee === undefined ||
      parsedData.tournamentRewardAmount === undefined
    ) {
      console.log("DATA is: ", data);
      toast.error("All form inputs are required");
      return;
    }

    if (!currentWallet) {
      toast.error("Wallet not found");
      return;
    }

    if (!currentConnection) {
      toast.error("Connection not found");
      return;
    }

    const currentEntryFee = {
      mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
      amount: new BN(100000 * parsedData.tournamentEntryFee),
    };

    const createdTournament = await createTournament(
      parsedData.tournamentName,
      parsedData.tournamentSize,
      currentWallet,
      currentConnection,
      currentEntryFee,
      parsedData.tournamentRewardAmount
    );

    // const createdTournament = false;

    if (createdTournament) {
      // if (createdTournament) {
      // setTournament(createdTournament);
      toast.success("Created Tournament");
      console.log("createdTournament: ", createdTournament);
    } else {
      toast.error("Failed to create tournament");
      setCreatingTournament(false);
    }
    // setCreatingTournament(false);
  };

  useEffect(() => {
    getTournamentsByGameName("Bounceback Reload").then((data: Tournament[]) => {
      setTournaments(data);
      // Check for tournament ID in URL and update state
      const tournamentId = router.query.tournamentId;
      if (tournamentId) {
        const tournament = data.find((t) => t.id.toString() === tournamentId);
        if (tournament) setSelectedTournament(tournament);
      }
    });
  }, [router.query.tournamentId]);

  const selectTournament = (tournament: Tournament) => {
    if (!loggedIn || solana_wallet_address.trim() == "") {
      toast.error("Login to view tournament details");
      return;
    }
    setSelectedTournament(tournament);
    // Update URL without navigating
    router.push(`?tournamentId=${tournament.id}`, undefined, { shallow: true });
  };
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  // const timeRemaining = (start: string, end: string) => {
  //   let now = dayjs();
  //   let startDate = dayjs(start);
  //   let endDate = dayjs(end);

  //   let diff;
  //   let status;

  //   if (now.isBefore(startDate)) {
  //     diff = dayjs.duration(startDate.diff(now));
  //     status = "Starts in";
  //   } else if (now.isBefore(endDate)) {
  //     diff = dayjs.duration(endDate.diff(now));
  //     status = "Ends in";
  //   } else {
  //     diff = dayjs.duration(0);
  //     status = "Ended";
  //   }

  //   return {
  //     time: `${formatNumber(diff.days())}d ${formatNumber(
  //       diff.hours()
  //     )}h ${formatNumber(diff.minutes())}m`,
  //     status: status,
  //   };
  // };

  // const formatUsername = (name: string) => {
  //   if (name.length <= 16) {
  //     return name;
  //   }
  //   if (name == "") {
  //     return "NA";
  //   }
  //   return `${name.substring(0, 3)}...${name.substring(name.length - 5)}`;
  // };

  if (selectedTournament) {
    // Render Tournament Details View
    return (
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        align="center"
        h="100%"
      >
        {creatingTournament || useLoadingStore.getState().loadingStatus ? (
          <Flex
            w="100%"
            h="100%"
            flexDirection="column"
            justifyContent="start"
            align="start"
          >
            <VStack>
              <Spinner color="#ffffff" />
              <Text color="white">CREATING TOURNAMENT</Text>
            </VStack>
            d
          </Flex>
        ) : (
          <Flex
            w="100%"
            h="100%"
            flexDirection="column"
            justifyContent="start"
            align="start"
          >
            <Flex w="100%" h="2rem" justifyContent="start" align="center">
              <Flex
                color="white"
                _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                flex={1}
              >
                <MdArrowBack
                  size="1.25rem"
                  style={{
                    marginLeft: "0px",
                    cursor: "pointer",
                    _hover: `{ color: "rgba(255, 255, 255, 0.8)" }`,
                  }}
                  onClick={() => setSelectedTournament(null)}
                />
              </Flex>
              <Flex flex={10}>
                <Text
                  color="#fbfbfb"
                  fontSize="1rem"
                  fontWeight="700"
                  textAlign="center"
                  width="100%"
                >
                  {selectedTournament.tournament_name}
                </Text>
              </Flex>
              <Flex flex={1} bg="blue"></Flex>
            </Flex>

            <Flex
              w="100%"
              h="1rem"
              justifyContent="space-between"
              align="center"
              mt="0.5rem"
            >
              <Flex>
                <Tooltip
                  label="Creation Date"
                  aria-label="Creation Date"
                  bg="black"
                  border="1px solid white"
                >
                  <Text
                    color={theme.colors.primary}
                    fontSize="0.75rem"
                    overflow="auto"
                    fontWeight="500"
                    textAlign="start"
                    width="100%"
                  >
                    {selectedTournament.start_datetime}
                  </Text>
                </Tooltip>
              </Flex>

              <Tooltip
                label="Tournament Members"
                aria-label="Tournament Members"
                bg="black"
                border="1px solid white"
              >
                <Flex justifyContent="flex-end">
                  <MdPerson size="1rem" />
                  <Text
                    color={theme.colors.primary}
                    fontSize="0.7rem"
                    fontWeight="700"
                    ml="0.25rem"
                  >
                    4/4
                  </Text>
                </Flex>
              </Tooltip>
            </Flex>
            <Flex
              w="100%"
              h="2rem"
              justifyContent="space-between"
              align="center"
              mt="0.5rem"
              gap="0.75rem"
            >
              <Flex
                justifyContent="center"
                align="center"
                bg={theme.colors.input}
                w="100%"
                h="100%"
                px="0.5rem"
                py="1rem"
                borderRadius="2px"
                flex={5}
              >
                <Text
                  fontSize="0.7rem"
                  fontWeight="800"
                  color={theme.colors.primary}
                >
                  PRIZE POOL:
                  {/* {`${tournament.creator}`} */}
                </Text>
                <Text
                  ml="0.25rem"
                  fontSize="0.7rem"
                  fontWeight="800"
                  color={theme.colors.green}
                >
                  ${`222`}.00
                </Text>
              </Flex>
              <Flex
                justifyContent="center"
                align="center"
                bg={theme.colors.input}
                w="100%"
                h="100%"
                px="0.5rem"
                py="0.25rem"
                borderRadius="2px"
                flex={5}
              >
                {/* <Text
              textAlign="center"
              fontSize="0.7rem"
              fontWeight="800"
              color={theme.colors.pink}
            >
              AWAITING PLAYERS
            </Text>{" "} */}
                {/* <Text
              textAlign="center"
              fontSize="0.7rem"
              fontWeight="800"
              color={theme.colors.orange}
            >
              IN PROGRESS
            </Text> */}
                <Text
                  textAlign="center"
                  fontSize="0.7rem"
                  fontWeight="800"
                  color={theme.colors.green}
                >
                  WINNINGS AVAILABLE
                </Text>
                {/* 
            <Text
              textAlign="center"
              fontSize="0.7rem"
              fontWeight="800"
              color={theme.colors.darkerGray}
            >
              FINISHED
            </Text> */}
              </Flex>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              align="center"
              bg={theme.colors.input}
              w="100%"
              h="11.25rem"
              my="0.75rem"
              p="0.75rem"
              borderRadius="2px"
              flex={5}
            >
              <Flex
                w="100%"
                h="10%"
                justifyContent="space-between"
                align="start"
                mb="0.5rem"
              >
                <Text
                  fontSize="0.7rem"
                  fontWeight="800"
                  color={theme.colors.primary}
                >
                  LEADERBOARD
                  {/* {`${tournament.creator}`} */}
                </Text>
                <Text
                  ml="0.25rem"
                  fontSize="0.7rem"
                  fontWeight="800"
                  color={theme.colors.primary}
                >
                  SCORE
                </Text>
              </Flex>

              <List
                width="100%"
                h="100%"
                justifyContent="space-between"
                overflowY="auto"
              >
                <Flex flexDirection="column" w="100%" h="100%" gap="0.5rem">
                  <Flex h="2rem" align="center" justifyContent="space-between">
                    <Flex align="center">
                      {" "}
                      <Text
                        fontSize="0.7rem"
                        fontWeight="800"
                        color={theme.colors.primary}
                        mr="0.5rem"
                      >
                        1.
                        {/* {`${tournament.creator}`} */}
                      </Text>
                      <Box alignItems="center" mr="0.5rem">
                        <Image
                          src={"/assets/ball.png"}
                          alt="Default ball image"
                          width={25}
                          height={25}
                          style={{ borderRadius: "50%" }}
                        />
                      </Box>
                      <Text
                        fontSize="0.7rem"
                        fontWeight="800"
                        color={theme.colors.primary}
                        mr="0.5rem"
                      >
                        ...
                        {/* {`${tournament.creator}`} */}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="0.7rem"
                      fontWeight="500"
                      fontStyle="italic"
                      color={theme.colors.primary}
                      mr="0.5rem"
                    >
                      0
                    </Text>
                  </Flex>
                  <Flex h="2rem" align="center" justifyContent="space-between">
                    <Flex align="center">
                      {" "}
                      <Text
                        fontSize="0.7rem"
                        fontWeight="800"
                        color={theme.colors.primary}
                        mr="0.5rem"
                      >
                        1.
                        {/* {`${tournament.creator}`} */}
                      </Text>
                      <Box alignItems="center" mr="0.5rem">
                        <Image
                          src={"/assets/ball.png"}
                          alt="Default ball image"
                          width={25}
                          height={25}
                          style={{ borderRadius: "50%" }}
                        />
                      </Box>
                      <Text
                        fontSize="0.7rem"
                        fontWeight="800"
                        color={theme.colors.primary}
                        mr="0.5rem"
                      >
                        ...
                        {/* {`${tournament.creator}`} */}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="0.7rem"
                      fontWeight="500"
                      fontStyle="italic"
                      color={theme.colors.primary}
                      mr="0.5rem"
                    >
                      0
                    </Text>
                  </Flex>
                  <Flex h="2rem" align="center" justifyContent="space-between">
                    <Flex align="center">
                      {" "}
                      <Text
                        fontSize="0.7rem"
                        fontWeight="800"
                        color={theme.colors.primary}
                        mr="0.5rem"
                      >
                        1.
                        {/* {`${tournament.creator}`} */}
                      </Text>
                      <Box alignItems="center" mr="0.5rem">
                        <Image
                          src={"/assets/ball.png"}
                          alt="Default ball image"
                          width={25}
                          height={25}
                          style={{ borderRadius: "50%" }}
                        />
                      </Box>
                      <Text
                        fontSize="0.7rem"
                        fontWeight="800"
                        color={theme.colors.primary}
                        mr="0.5rem"
                      >
                        ...
                        {/* {`${tournament.creator}`} */}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="0.7rem"
                      fontWeight="500"
                      fontStyle="italic"
                      color={theme.colors.primary}
                      mr="0.5rem"
                    >
                      0
                    </Text>
                  </Flex>
                  <Flex h="2rem" align="center" justifyContent="space-between">
                    <Flex align="center">
                      {" "}
                      <Text
                        fontSize="0.7rem"
                        fontWeight="800"
                        color={theme.colors.primary}
                        mr="0.5rem"
                      >
                        1.
                        {/* {`${tournament.creator}`} */}
                      </Text>
                      <Box alignItems="center" mr="0.5rem">
                        <Image
                          src={"/assets/ball.png"}
                          alt="Default ball image"
                          width={25}
                          height={25}
                          style={{ borderRadius: "50%" }}
                        />
                      </Box>
                      <Text
                        fontSize="0.7rem"
                        fontWeight="800"
                        color={theme.colors.primary}
                        mr="0.5rem"
                      >
                        ...
                        {/* {`${tournament.creator}`} */}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="0.7rem"
                      fontWeight="500"
                      fontStyle="italic"
                      color={theme.colors.primary}
                      mr="0.5rem"
                    >
                      0
                    </Text>
                  </Flex>
                </Flex>
              </List>
            </Flex>
            <Flex w="100%" h="100%">
              <Button
                mb="1rem"
                bg={theme.colors.green}
                color="white"
                width="100%"
                borderColor={theme.colors.green}
                borderWidth="2px"
                borderRadius="1px"
                h="2.25rem"
                w="100%"
                fontSize="0.8rem"
                fontWeight="700"
                isDisabled={false}
                _hover={{
                  bg: theme.colors.darkerGreen,
                  borderColor: theme.colors.darkerGreen,
                }}
                onClick={() => setCreatingTournament(true)}
              >
                JOIN FOR ${selectedTournament.id}.00
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    );
  }

  if (creatingTournament) {
    // Render Tournament Details View
    return (
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        align="center"
        h="100%"
      >
        <Flex
          w="100%"
          h="100%"
          flexDirection="column"
          justifyContent="start"
          align="space-between"
        >
          <Flex w="100%" h="2rem" justifyContent="start" align="center">
            <Flex flex={10}>
              <Text
                color="#fbfbfb"
                fontSize="1rem"
                fontWeight="700"
                textAlign="start"
                width="100%"
              >
                CREATE TOURNAMENT
              </Text>
            </Flex>
            <Flex flex={1}></Flex>
          </Flex>
          <Flex
            w="100%"
            h="100%"
            justifyContent="start"
            align="start"
            mt="0.5rem"
          >
            <VStack
              as="form"
              onSubmit={handleSubmit(handleCreateTournament)}
              w="100%"
            >
              <Flex flexDirection="column" w="100%" mt="0rem">
                <Text
                  fontWeight="700"
                  fontFamily={theme.fonts.body}
                  fontSize="0.75rem"
                  pb="0.25rem"
                >
                  TOURNAMENT NAME *
                </Text>
                <Controller
                  name="tournamentName"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Name your tournament"
                      w="100%"
                      h="2rem"
                      fontSize="0.75rem"
                      bg={theme.colors.input}
                      borderWidth="2px"
                      borderRadius="1px"
                      borderColor={theme.colors.input}
                      fontWeight="500"
                      letterSpacing="1px"
                      color={theme.colors.primary}
                      focusBorderColor={theme.colors.input}
                      _placeholder={{ color: theme.colors.darkerGray }}
                      _focus={{ boxShadow: "none" }}
                    />
                  )}
                />

                {errors.tournamentName && (
                  <Flex w="97%" h="1rem" justifyContent="start" m="0" p="0">
                    <Text fontSize="0.75rem" color="red" m="0" p="0">
                      Tournament is required
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Flex flexDirection="column" w="100%" mt="0rem">
                <Text
                  fontWeight="700"
                  fontFamily={theme.fonts.body}
                  fontSize="0.75rem"
                  pb="0.25rem"
                >
                  TOURNAMENT SIZE (max # of players) *{" "}
                </Text>
                <Controller
                  name="tournamentSize"
                  control={control}
                  defaultValue={2}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter a tournament size"
                      w="100%"
                      h="2rem"
                      fontSize="0.75rem"
                      bg={theme.colors.input}
                      borderWidth="2px"
                      borderRadius="1px"
                      borderColor={theme.colors.input}
                      fontWeight="500"
                      letterSpacing="1px"
                      color={theme.colors.primary}
                      focusBorderColor={theme.colors.input}
                      _placeholder={{ color: theme.colors.darkerGray }}
                      _focus={{ boxShadow: "none" }}
                    />
                  )}
                />

                {errors.tournamentSize && (
                  <Flex w="97%" h="1rem" justifyContent="start" m="0" p="0">
                    <Text fontSize="0.75rem" color="red" m="0" p="0">
                      Tournament size is required
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Flex flexDirection="column" w="100%" mt="0rem">
                <Text
                  fontWeight="700"
                  fontFamily={theme.fonts.body}
                  fontSize="0.75rem"
                  pb="0.25rem"
                >
                  ENTRY FEE (in $USD) *{" "}
                </Text>
                <Controller
                  name="tournamentEntryFee"
                  control={control}
                  defaultValue={0}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter a tournament entry fee in USD"
                      w="100%"
                      h="2rem"
                      fontSize="0.75rem"
                      bg={theme.colors.input}
                      borderWidth="2px"
                      borderRadius="1px"
                      borderColor={theme.colors.input}
                      fontWeight="500"
                      letterSpacing="1px"
                      color={theme.colors.primary}
                      focusBorderColor={theme.colors.input}
                      _placeholder={{ color: theme.colors.darkerGray }}
                      _focus={{ boxShadow: "none" }}
                    />
                  )}
                />

                {errors.tournamentEntryFee && (
                  <Flex w="97%" h="1rem" justifyContent="start" m="0" p="0">
                    <Text fontSize="0.75rem" color="red" m="0" p="0">
                      Tournament entry fee is required
                    </Text>
                  </Flex>
                )}
              </Flex>
              <Flex flexDirection="column" w="100%" mt="0rem">
                <Text
                  fontWeight="700"
                  fontFamily={theme.fonts.body}
                  fontSize="0.75rem"
                  pb="0.25rem"
                >
                  SEED PRIZE POOL (in $USD) *{" "}
                </Text>
                <Controller
                  name="tournamentRewardAmount"
                  control={control}
                  defaultValue={0}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter an amount of USD to seed prize pool with"
                      w="100%"
                      h="2rem"
                      fontSize="0.75rem"
                      bg={theme.colors.input}
                      borderWidth="2px"
                      borderRadius="1px"
                      borderColor={theme.colors.input}
                      fontWeight="500"
                      letterSpacing="1px"
                      color={theme.colors.primary}
                      focusBorderColor={theme.colors.input}
                      _placeholder={{ color: theme.colors.darkerGray }}
                      _focus={{ boxShadow: "none" }}
                    />
                  )}
                />

                {errors.tournamentRewardAmount && (
                  <Flex w="97%" h="1rem" justifyContent="start" m="0" p="0">
                    <Text fontSize="0.75rem" color="red" m="0" p="0">
                      Prize pool seed amount is required
                    </Text>
                  </Flex>
                )}
              </Flex>
              <Flex w="100%" gap="0.75rem" my="0.75rem">
                <Button
                  bg={theme.colors.red}
                  color="white"
                  width="100%"
                  borderColor={theme.colors.red}
                  borderWidth="2px"
                  borderRadius="1px"
                  h="2.25rem"
                  w="100%"
                  fontSize="0.8rem"
                  fontWeight="700"
                  isDisabled={false}
                  _hover={{ bg: "#ea0000", borderColor: "#ea0000" }}
                  onClick={() => setCreatingTournament(false)}
                >
                  CANCEL
                </Button>
                <Button
                  bg={theme.colors.green}
                  color="white"
                  width="100%"
                  borderColor={theme.colors.green}
                  borderWidth="2px"
                  borderRadius="1px"
                  h="2.25rem"
                  w="100%"
                  fontSize="0.8rem"
                  fontWeight="700"
                  isDisabled={false}
                  type="submit"
                  _hover={{
                    bg: theme.colors.darkerGreen,
                    borderColor: theme.colors.darkerGreen,
                  }}
                >
                  CREATE
                </Button>
              </Flex>
            </VStack>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      align="center"
      h="100%"
    >
      <Flex w="100%" h="100%">
        <Text
          color="#fbfbfb"
          fontSize="1.25rem"
          fontWeight="700"
          textAlign="start"
          width="100%"
        >
          TOURNAMENTS
        </Text>
      </Flex>

      <Flex w="100%" h="100%" justifyContent="start">
        <List width="100%" h="15.25rem" overflowY="auto">
          {tournaments.length > 0 || true ? (
            <>
              <Box
                width="100%"
                height="90px"
                p={3}
                mb={3}
                backgroundColor="#1A1A1D"
              >
                <VStack
                  h="100%"
                  alignContent="space-between"
                  justifyContent="space-between"
                >
                  <Flex w="100%" h="100%" justifyContent="space-between">
                    <Flex h="100%">
                      <Text
                        fontSize="12px"
                        color="#fbfbfb"
                        fontWeight="bold"
                        pr="0.5rem"
                      >
                        {`OGS SLAMMER`}
                      </Text>

                      <Tooltip
                        label="Copy Tournament ID"
                        aria-label="Copy Tournament ID"
                        bg="black"
                        border="1px solid white"
                      >
                        <Flex
                          color="white"
                          _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                          mr="0.5rem"
                        >
                          <FaCopy
                            size="0.9rem"
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                            onClick={async () => {
                              try {
                                // await navigator.clipboard.writeText(solana_wallet_address);
                                toast.success("Copied Username");
                              } catch (err) {
                                console.error("Failed to copy address: ", err);
                                toast.error("Failed to copy address");
                              }
                            }}
                          />
                        </Flex>
                      </Tooltip>
                      <Tooltip
                        label="Share Link"
                        aria-label="Share Link"
                        bg="black"
                        border="1px solid white"
                      >
                        <Flex
                          color="white"
                          _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                          mr="0.5rem"
                        >
                          <FaShare
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                            size="1rem"
                            onClick={async () => {
                              try {
                                // await navigator.clipboard.writeText(solana_wallet_address);
                                toast.success("Copied Share Link");
                              } catch (err) {
                                console.error("Failed to copy address: ", err);
                                toast.error("Failed to copy address");
                              }
                            }}
                          />
                        </Flex>
                      </Tooltip>
                    </Flex>

                    <Tooltip
                      label="Tournament Lobby"
                      aria-label="Tournament Lobby"
                      bg="black"
                      border="1px solid white"
                    >
                      <Flex>
                        <MdPerson size="1.25rem" color="white" />

                        <Text
                          ml="0.25rem"
                          fontSize="12px"
                          color={theme.colors.primary}
                          fontWeight="bold"
                        >
                          {`4/4`}
                        </Text>
                      </Flex>
                    </Tooltip>
                  </Flex>
                  <Flex
                    w="100%"
                    h="100%"
                    justifyContent="space-between"
                    align="flex-end"
                  >
                    <Flex>
                      <Text fontSize="12px" fontStyle="italic" color="#fbfbfb">
                        Creator:
                      </Text>
                      <Text
                        ml="0.25rem"
                        fontSize="12px"
                        fontWeight="700"
                        fontStyle="italic"
                        color={theme.colors.primary}
                      >
                        e5T....56tW
                        {/* {`${tournament.creator}`} */}
                      </Text>
                    </Flex>
                    <Flex>
                      {/* <Text fontSize="12px" color={theme.colors.orange} fontWeight="bold">
                        {`IN PROGRESS`}
                      </Text> */}
                      <Text
                        fontSize="12px"
                        color={theme.colors.pink}
                        fontWeight="bold"
                        cursor="pointer"
                        onClick={() =>
                          selectTournament({
                            id: 1,
                            game_name: "name",
                            tournament_name: "tourn name",
                            start_datetime: "start",
                            end_datetime: "end",
                            tournament_link: "link",
                          })
                        }
                      >
                        {`AWAITING PLAYERS >`}
                      </Text>
                      {/* <Text
                        fontSize="12px"
                        color={theme.colors.darkerGray}
                        fontWeight="bold"
                      >
                        {`FINISHED`}
                      </Text> */}
                      {/* <Text
                        fontSize="12px"
                        color={theme.colors.green}
                        fontWeight="bold"
                      >
                        {`WINNINGS AVAILABLE`}
                      </Text> */}
                    </Flex>
                  </Flex>
                </VStack>
              </Box>{" "}
            </>
          ) : (
            // tournaments.map((tournament: Tournament, index: number) => {
            //   const { time, status } = timeRemaining(
            //     tournament.start_datetime,
            //     tournament.end_datetime
            //   );
            //   return (
            //     <Link
            //       key={index}
            //       href={`https://rex-retro-tournaments.r3x.tech/tournament/${tournament.id}`}
            //     >
            //       <Box
            //         width="100%"
            //         height="90px"
            //         p={3}
            //         mb={3}
            //         backgroundColor="#1A1A1D"
            //         cursor="pointer"
            // onClick={() => selectTournament(tournaments[i])}

            //       >
            //         <VStack align="start" spacing={1}>
            //           <Text fontSize="14px" color="#fbfbfb" fontWeight="bold">
            //             {`${tournament.tournament_name}`}
            //           </Text>
            //           <Text fontSize="14px" color="#fbfbfb">
            //             {`${status}: ${time}`}
            //           </Text>
            //         </VStack>
            //       </Box>
            //     </Link>
            //   );
            // })
            <Text color="#fbfbfb" textAlign="start" my="10px" fontSize="0.8rem">
              NO ACTIVE TOURNAMENTS
            </Text>
          )}
        </List>
      </Flex>
      <Flex w="100%" h="100%">
        <Button
          bg={theme.colors.green}
          color="white"
          width="100%"
          borderColor={theme.colors.green}
          borderWidth="2px"
          borderRadius="1px"
          h="2.25rem"
          w="100%"
          fontSize="0.8rem"
          fontWeight="700"
          isDisabled={false}
          _hover={{
            bg: theme.colors.darkerGreen,
            borderColor: theme.colors.darkerGreen,
          }}
          onClick={() => setCreatingTournament(true)}
        >
          CREATE NEW +
        </Button>
      </Flex>
    </Flex>
  );
}

type FormData = {
  tournamentName: string;
  tournamentSize: number;
  // tournamentType: Map<string, number>;
  tournamentEntryFee: number;
  tournamentRewardAmount: number;
};
