import React, { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import SupplierLayout from "@/layouts/SupplierLayout";
import Head from "next/head";
import useRawMaterials from "@/hooks/useRawMaterials";
import { IRawMaterial } from "@/types/Contracts";
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

const ViewRawMaterials: NextPageWithLayout = () => {
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const { getRawMaterials } = useRawMaterials();

  const [rawMaterials, setRawMaterials] = useState<IRawMaterial[]>([]);

  const fetchItems = async () => {
    const items = await getRawMaterials();
    if (items) {
      const newItems = Object.values(items)[0];
      // @ts-ignore
      setRawMaterials(newItems);
    }
  };
  useEffect(() => {
    const abortController = new AbortController();
    fetchItems();
    return () => {
      abortController.abort();
    };
  }, []);

  console.log(rawMaterials);

  return (
    <>
      <Head>
        <title>AgriTrace | RawMaterials</title>
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
              Name
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              EntityCode
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              BatchNo
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
          {rawMaterials.length === 0 ? (
            <Text px={50}>
              No Raw Materials Added Yet
            </Text>
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
                    <chakra.span>{item?.name}</chakra.span>
                    <chakra.span>{item?.entityCode}</chakra.span>
                    <chakra.span>{item?.batchNo}</chakra.span>

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
              </div>
            ))
          )}
        </Stack>
      </Flex>
    </>
  );
};

ViewRawMaterials.getLayout = (page) => <SupplierLayout>{page} </SupplierLayout>;

export default ViewRawMaterials;
