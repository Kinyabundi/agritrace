import { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import {
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";
import {
  useColorModeValue,
  Flex,
  Stack,
  SimpleGrid,
  chakra,
  Text,
  Divider,
  Select,
} from "@chakra-ui/react";
import { truncateHash } from "@/utils/truncateHash";
import {
  IEntity,
  TransactionStatus,
  transactionStatusArray,
} from "@/types/Transaction";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import useTransaction from "@/hooks/useTransaction";
import useInterval from "@/hooks/useInterval";
import AdminLayout from "@/layouts/AdminLayout";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const RawMaterials: NextPageWithLayout = () => {
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const { getTransactionsByStatus, getAllEntities } = useTransaction();
  const { activeSigner, api, activeAccount } = useInkathon();
  const [loading, setLoading] = useState<boolean>(false);
  const [rawMaterials, setRawMaterials] = useState<IEntity[]>([]);
  const { contract } = useRegisteredContract(ContractID.Transactions);
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.Initiated
  );

  const fetchItems = async () => {
    const items = await getAllEntities();
    if (items) {
      setRawMaterials(items);
    }
  };

  const fetchItemsByStatus = async (status: TransactionStatus) => {
    const rawMaterialsStatus = await getTransactionsByStatus(status);
    if (rawMaterialsStatus) {
      setStatus(rawMaterialsStatus);
    }
  };

  useInterval(() => {
    fetchItems();
  }, 3000);

  useEffect(() => {
    fetchItemsByStatus(status);
  }, [activeAccount]);

  console.log(rawMaterials);

  return (
    <>
      <Head>
        <title>AgriTrace | Suppliers | Sales</title>
      </Head>

      <Flex w="full" align={"center"} justify={"space-between"}>
        <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
          Raw Materials
        </Text>
        <Select
          size={"md"}
          w={"52"}
          placeholder={"Transaction Status"}
          defaultValue={TransactionStatus.Initiated}
          onChange={(e) => {
            fetchItemsByStatus(e.target.value as TransactionStatus);
          }}
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
            md: 7,
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
            Buyer
          </chakra.span>
        </SimpleGrid>
        {rawMaterials.length > 0 ? (
          rawMaterials.map((entity) => (
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
                    md: 7,
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
                    {entity.quantity} {entity.quantityUnit}
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
                    {truncateHash(entity.buyer)}
                  </chakra.span>
                  {/* <VStack
                    justify={{
                      md: "end",
                    }}
                  >
                    {entity.status === TransactionStatus.Completed && (
                      <Button variant="solid" colorScheme="teal" size="sm">
                        Accepted and Completed
                      </Button>
                    )}
                    {entity.status === TransactionStatus.Initiated && (
                      <Button variant="solid" colorScheme="red" size="sm">
                        Revert
                      </Button>
                    )}
                    {entity.status === TransactionStatus.InProgress && (
                      <Button
                        variant="solid"
                        colorScheme="teal"
                        size="sm"
                        onClick={() =>
                          completeEntityTransaction(entity.entityCode)
                        }
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </VStack> */}
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
              No Raw Materials Listed
            </Text>
          </Flex>
        )}
      </Stack>
    </>
  );
};

RawMaterials.getLayout = (page) => <AdminLayout>{page} </AdminLayout>;

export default RawMaterials;
