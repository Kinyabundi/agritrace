import React from "react";
import { NextPageWithLayout } from "@/types/Layout";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import Head from "next/head";
import {
  useColorModeValue,
  Flex,
  Stack,
  SimpleGrid,
  chakra,
  Button,
  Text,
  Divider,
} from "@chakra-ui/react";

const Suppliers: NextPageWithLayout = () => {
  const data = [
    {
      name: "Segun Adebayo",
      email: "sage@chakra.com",
    },
    {
      name: "Josef Nikolas",
      email: "Josef@mail.com",
    },
    {
      name: "Lazar Nikolov",
      email: "Lazar@mail.com",
    },
    {
      name: "Abraham",
      email: "abraham@anu.com",
    },
  ];
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  return (
    <>
      <Head>
        <title>AgriTrace | Suppliers</title>
      </Head>
      <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
        Suppliers
      </Text>
      <Flex
        w="full"
        bg="#edf3f8"
        _dark={{
          bg: "#3e3e3e",
        }}
        p={50}
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          direction={{
            base: "column",
          }}
          w="full"
          bg={{
            md: bg,
          }}
          shadow="lg"
        >
          <SimpleGrid
            spacingY={3}
            columns={{
              base: 1,
              md: 3,
            }}
            w={{
              base: 120,
              md: "full",
            }}
            textTransform="uppercase"
            bg={bg2}
            color={"gray.800"}
            py={{
              base: 1,
              md: 4,
            }}
            px={{
              base: 2,
              md: 10,
            }}
            fontSize="md"
            fontWeight="hairline"
          >
            <chakra.span color="blue.800" fontWeight="600">
              Name
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              Email
            </chakra.span>
            <chakra.span
              color="blue.800"
              fontWeight="600"
              textAlign={{
                md: "right",
              }}
            >
              Actions
            </chakra.span>
          </SimpleGrid>
          {data.map((person, pid) => {
            return (
              <>
                <Flex
                  direction={{
                    base: "row",
                    md: "column",
                  }}
                  bg={dataColor}
                  key={pid}
                >
                  <SimpleGrid
                    spacingY={3}
                    columns={{
                      base: 1,
                      md: 3,
                    }}
                    w="full"
                    py={2}
                    px={10}
                    fontWeight="400"
                  >
                    <chakra.span>{person.name}</chakra.span>
                    <chakra.span
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="nowrap"
                    >
                      {person.email}
                    </chakra.span>
                    <Flex
                      justify={{
                        md: "end",
                      }}
                    >
                      <Button variant="solid" colorScheme="red" size="sm">
                        Delete
                      </Button>
                    </Flex>
                  </SimpleGrid>
                </Flex>
                <Divider />
              </>
            );
          })}
        </Stack>
      </Flex>
    </>
  );
};

Suppliers.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;
export default Suppliers;
