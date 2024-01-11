import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  List,
  VStack,
  Button,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { Tournament, getTournamentsByGameName } from "../utils/getTournaments";
import theme from "@/styles/theme";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Link from "next/link";
import userStore from "@/stores/userStore";
import { IoMdTrophy } from "react-icons/io";
import { MdPerson } from "react-icons/md";
import { FaCopy, FaShare } from "react-icons/fa";
import toast from "react-hot-toast";

dayjs.extend(duration);

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const {
    username,
    loggedIn,
    loginType,
    solana_wallet_address,
    ip_address,
    userProfilePic,
  } = userStore();

  useEffect(() => {
    getTournamentsByGameName("Meteor Crash").then((data: Tournament[]) => {
      setTournaments(data);
    });
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const timeRemaining = (start: string, end: string) => {
    let now = dayjs();
    let startDate = dayjs(start);
    let endDate = dayjs(end);

    let diff;
    let status;

    if (now.isBefore(startDate)) {
      diff = dayjs.duration(startDate.diff(now));
      status = "Starts in";
    } else if (now.isBefore(endDate)) {
      diff = dayjs.duration(endDate.diff(now));
      status = "Ends in";
    } else {
      diff = dayjs.duration(0);
      status = "Ended";
    }

    return {
      time: `${formatNumber(diff.days())}d ${formatNumber(
        diff.hours()
      )}h ${formatNumber(diff.minutes())}m`,
      status: status,
    };
  };

  const formatUsername = (name: string) => {
    if (name.length <= 16) {
      return name;
    }
    if (name == "") {
      return "NA";
    }
    return `${name.substring(0, 3)}...${name.substring(name.length - 5)}`;
  };

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
          fontSize="21px"
          fontWeight="700"
          textAlign="start"
          width="100%"
        >
          TOURNAMENTS
        </Text>
      </Flex>

      <Flex w="100%" h="100%" justifyContent="start">
        <List width="100%" h="15rem" overflowY="auto">
          {tournaments.length > 0 || true ? (
            <>
              <Box
                width="100%"
                height="90px"
                p={3}
                mb={3}
                backgroundColor="#1A1A1D"
                cursor="pointer"
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
                                toast.success("Copied Username");
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
                      >
                        {`AWAITING PLAYERS`}
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
            bg: theme.colors.greenhighlight,
            borderColor: theme.colors.greenhighlight,
          }}
          onClick={() => {}}
        >
          CREATE NEW +
        </Button>
      </Flex>
    </Flex>
  );
}
