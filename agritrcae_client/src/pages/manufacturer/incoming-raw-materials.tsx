import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import {
  Button,
  chakra,
  Divider,
  Flex,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  IEntity,
  TransactionStatus,
  transactionStatusArray,
} from "@/types/Transaction";
import { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { truncateHash } from "@/utils/truncateHash";
import useManufacturer from "@/hooks/useManufacturer";
import { useInkathon } from "@scio-labs/use-inkathon";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const IncomingRawMaterials: NextPageWithLayout = () => {
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");

  const { getIncomingEntities } = useManufacturer();
  const { activeAccount } = useInkathon();

  const [entities, setEntities] = useState<IEntity[]>([]);

  const fetchEntities = async () => {
    const incoming_entities = await getIncomingEntities();
    if (incoming_entities) {
      setEntities(incoming_entities);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [activeAccount]);

  return (
    <>
      <Head>
        <title>AgriTrace | Suppliers</title>
      </Head>

      <Flex w="full" align={"center"} justify={"space-between"}>
        <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
          Incoming Supplies
        </Text>
        <Select
          size={"md"}
          w={"52"}
          placeholder={"Transaction Status"}
          defaultValue={TransactionStatus.Initiated}
        >
          {transactionStatusArray.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Flex>

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
            md: 8,
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
            Entity Code
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Quantity
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Status
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Batch No
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Created
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Updated
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Seller
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
        {entities.length > 0 ? (
          entities.map((entity) => (
            <>
              <Flex
                direction={{
                  base: "row",
                  md: "column",
                }}
                bg={dataColor}
                key={entity.batchNo}
                align={"center"}
              >
                <SimpleGrid
                  spacingY={3}
                  columns={{
                    base: 1,
                    md: 8,
                  }}
                  w="full"
                  py={2}
                  px={10}
                  fontWeight="400"
                  fontSize="sm"
                >
                  <chakra.span color="blue.800" fontWeight="600">
                    {entity.entityCode}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {entity.quantity} {" "} {entity.quantityUnit}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {entity.status}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {entity.batchNo}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {timeAgo.format(new Date(entity.createdAt))}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {timeAgo.format(new Date(entity.updatedAt))}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {truncateHash(entity.seller)}
                  </chakra.span>
                  <VStack
                    justify={{
                      md: "end",
                    }}
                    
                  >
                    <Button variant="solid" colorScheme="teal" size="sm">
                      Accept
                    </Button>
                    <Button variant="solid" colorScheme="red" size="sm">
                      Reject
                    </Button>
                  </VStack>
                </SimpleGrid>
              </Flex>
              <Divider />
            </>
          ))
        ) : (
          <Flex
            w="full"
            align={"center"}
            justify={"center"}
            bg={dataColor}
            py={10}
          >
            <Text fontSize={"2xl"} fontWeight={"semibold"}>
              No Incoming Supplies
            </Text>
          </Flex>
        )}
      </Stack>
    </>
  );
};

IncomingRawMaterials.getLayout = (page) => (
  <ManufacturerLayout>{page}</ManufacturerLayout>
);

export default IncomingRawMaterials;
