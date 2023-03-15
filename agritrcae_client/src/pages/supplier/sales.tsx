import React, { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import SupplierLayout from "@/layouts/SupplierLayout";
import Head from "next/head";
import Manufacturer from "@/components/SaleModal";
import useRawMaterials from "@/hooks/useRawMaterials";
import useManufacturer from "@/hooks/useManufacturer";
import { IRawMaterial } from "@/types/Contracts";
import { IManufacturer } from "@/types/Manufacturer";
import { IToastProps } from "@/types/Toast";
import {
  contractQuery,
  contractTx,
  unwrapResultOrError,
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
  Button,
  Text,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { truncateHash } from "@/utils/truncateHash";


const ViewSales: NextPageWithLayout = () => {
  const toast = useToast();
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const {  getSuppliersTransactions } = useRawMaterials();
  const { activeSigner, api, activeAccount } = useInkathon();
  const [loading, setLoading] = useState<boolean>(false);
  const [rawMaterials, setRawMaterials] = useState<IRawMaterial[]>([]);
  const { contract } = useRegisteredContract(ContractID.Transactions);

  const customToast = ({
    title,
    description,
    status,
    position,
  }: IToastProps) => {
    return toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: position || "top",
    });
  };

 
  const fetchItems = async () => {
    const items = await  getSuppliersTransactions();
    if (items) {
      setRawMaterials(items);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [activeAccount]);

  console.log(rawMaterials);

  return (
    <>
      <Head>
        <title>AgriTrace | Raw Materials</title>
      </Head>
      <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
        Raw Materials
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
              md: 4,
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
              EntityCode
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              Quantity
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              BatchNo
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              Buyer
            </chakra.span>
            {/* <chakra.span
              color="blue.800"
              fontWeight="600"
            >
              Status
            </chakra.span> */}
          </SimpleGrid>
          <>
            {rawMaterials.length === 0 ? (
              <Text px={50}>No Sales Made Yet</Text>
            ) : (
              rawMaterials?.map((item, pid) => (
                <div key={pid}>
                  <Flex
                    direction={{
                      base: "row",
                      md: "column",
                    }}
                    bg={dataColor}
                  >
                    <SimpleGrid
                      spacingY={3}
                      columns={{
                        base: 1,
                        md: 4,
                      }}
                      w="full"
                      py={2}
                      px={10}
                      fontWeight="400"
                    >
                      <chakra.span>{item?.entityCode}</chakra.span>
                      <chakra.span>{item?.quantity}</chakra.span>
                      <chakra.span>{item?.batchNo}</chakra.span>
                      <chakra.span>{truncateHash(item?.buyer)}</chakra.span>
                    </SimpleGrid>
                  </Flex>
                  <Divider />
                </div>
              ))
            )}
          </>
        </Stack>
      </Flex>
    </>
  );
};

ViewSales.getLayout = (page) => <SupplierLayout>{page} </SupplierLayout>;


export default ViewSales;

