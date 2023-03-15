import React, { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import useManufacturer from "@/hooks/useManufacturer";
import { IToastProps } from "@/types/Toast";
import {
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID, IProduct } from "@/types/Contracts";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";

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

const ViewProducts: NextPageWithLayout = () => {
  const toast = useToast();
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const { activeAccount } = useInkathon();
  const [products, setProducts] = useState<IProduct[]>([]);
  const {getProductsByAddedBy} = useManufacturer();
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

  useEffect(() => {
    fetchProducts();
  }, [activeAccount]);

  const fetchProducts = async () => {
    const items = await getProductsByAddedBy();
    if (items) {
      setProducts(items);
    }
  };
 

console.log(products)

  return (
    <>
      <Head>
        <title>AgriTrace | Products </title>
      </Head>
      <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
        Products
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
              md: 5,
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
              md: 5,
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
              ProductCode
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              Quantity
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              RawMaterials
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              Action
            </chakra.span>
            {/* <chakra.span
              color="blue.800"
              fontWeight="600"
              textAlign={{
                md: "right",
              }}
            >
              Actions
            </chakra.span> */}
          </SimpleGrid>
          <>
            {products.length === 0 ? (
              <Text px={50}>No Products Added Yet</Text>
            ) : (
              products?.map((item, pid) => (
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
                        md: 5,
                      }}
                      w="full"
                      py={2}
                      px={10}
                      fontWeight="400"
                    >
                      <chakra.span>{item?.name}</chakra.span>
                      <chakra.span>{item?.productCode}</chakra.span>
                      <chakra.span>{item?.quantity}</chakra.span>
                      <chakra.span>{item?.rawMaterials}</chakra.span>
                      {/* <chakra.span></chakra.span> */}
                      <Flex
                        justify={{
                          md: "end",
                        }}
                      >
                        <Button
                          variant="solid"
                          colorScheme="red"
                          size="sm"
                          //  onClick={fetchManufacturers}
                        >
                          sell
                        </Button>
                      </Flex>
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

ViewProducts.getLayout = (page) => <ManufacturerLayout>{page} </ManufacturerLayout>;

export default ViewProducts;
