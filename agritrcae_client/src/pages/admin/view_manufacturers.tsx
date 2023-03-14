import React, { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
import useManufacturer from "@/hooks/useManufacturer";
import { IManufacturer } from "@/types/Manufacturer";
import { IToastProps } from "@/types/Toast";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
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

const ViewManufacturers: NextPageWithLayout = () => {
  const toast = useToast();
  const { activeAccount } = useInkathon();
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const { getManufacturers } = useManufacturer();
  const [manufacturers, setManufacturers] = useState<IManufacturer[]>([]);

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
    fetchManufacturers();
  }, [activeAccount]);

  const fetchManufacturers = async () => {
    const manufacturers = await getManufacturers();
    if (manufacturers) {
      setManufacturers(manufacturers);
    }
  };
  console.log(manufacturers);

  return (
    <>
      <Head>
        <title>AgriTrace | Manufacturers</title>
      </Head>
      <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
        Manufacturers
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
            spacingY={4}
            columns={{
              base: 1,
              md: 6,
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
              md: 6,
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
              Address
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              CorporateNo
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              PhoneNos
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              Products
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
          {manufacturers.length === 0 ? (
            <Text px={50}>No Manufacturer is listed Yet</Text>
          ) : (
            manufacturers?.map((item, pid) => (
              <div key={pid}>
                <Flex
                  direction={{
                    base: "row",
                    md: "column",
                  }}
                  bg={dataColor}
                >
                  <SimpleGrid
                    spacingY={4}
                    columns={{
                      base: 1,
                      md: 6,
                    }}
                    w="full"
                    py={5}
                    px={10}
                    fontWeight="400"
                  >
                    <chakra.span>{item?.name}</chakra.span>
                    <chakra.span>{truncateHash(item?.address)}</chakra.span>
                    <chakra.span>{item?.corporateNo}</chakra.span>
                    <chakra.span>{item?.phoneNos.join(", ")}</chakra.span>
                    <chakra.span> {item?.products.join(", ")} </chakra.span>
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
                        View Suppliers
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

ViewManufacturers.getLayout = (page) => <AdminLayout>{page} </AdminLayout>;

export default ViewManufacturers;
