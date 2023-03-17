import React, { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import { IToastProps } from "@/types/Toast";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID, IProductSold } from "@/types/Contracts";
import {
  useColorModeValue,
  Flex,
  Stack,
  SimpleGrid,
  chakra,
  Button,
  Text,
  Divider,
  VStack,
  Select,
} from "@chakra-ui/react";
import { truncateHash } from "@/utils/truncateHash";
import {
  IProductSale,
  TransactionStatus,
  transactionStatusArray,
} from "@/types/Transaction";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import useTransaction from "@/hooks/useTransaction";
import { toast } from "react-hot-toast";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import useInterval from "@/hooks/useInterval";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const ViewSales: NextPageWithLayout = () => {
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const { getManufacturersTransactions } = useTransaction();
  const { activeSigner, api, activeAccount } = useInkathon();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductSale[]>([]);
  const { contract } = useRegisteredContract(ContractID.Transactions);

  const fetchProducts = async () => {
    const items = await getManufacturersTransactions();
    if (items) {
      setProducts(items);
    }
  };

  useInterval(() => fetchProducts(), 3000);
 

  useEffect(() => {
    fetchProducts();
  }, [activeAccount]);

  console.log(products);

  return (
    <>
      <Head>
        <title>AgriTrace | Manufacturer | Sales</title>
      </Head>

      <Flex w="full" align={"center"} justify={"space-between"}>
        <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
          Outgoing Supplies
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
            Product Code
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Quantity
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Status
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Serial No
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
        {products.length > 0 ? (
          products.map((product) => (
            <>
              <Flex
                direction={{
                  base: "row",
                  md: "column",
                }}
                bg={dataColor}
                key={product.serialNo}
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
                    {product.productCode}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {product.quantity} {product.quantityUnit}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {product.status}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {product.serialNo}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {timeAgo.format(new Date(product.createdAt))}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {timeAgo.format(new Date(product.updatedAt))}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {truncateHash(product.buyer)}
                  </chakra.span>
                  <VStack
                    justify={{
                      md: "end",
                    }}
                  >
                    {product.status === TransactionStatus.Completed && (
                      <Button variant="solid" colorScheme="teal" size="sm">
                        Accepted and Completed
                      </Button>
                    )}
                    {product.status === TransactionStatus.Initiated && (
                      <Button variant="solid" colorScheme="red" size="sm">
                        Revert
                      </Button>
                    )}
                   
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
              No Outgoing Supplies
            </Text>
          </Flex>
        )}
      </Stack>
    </>
  );
};

ViewSales.getLayout = (page) => <ManufacturerLayout>{page} </ManufacturerLayout>;

export default ViewSales;
