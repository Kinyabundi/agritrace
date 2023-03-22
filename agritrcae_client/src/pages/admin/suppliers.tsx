import useSupplier from "@/hooks/useSupplier";
import AdminLayout from "@/layouts/AdminLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ISupplier } from "@/types/Supplier";
import { truncateHash } from "@/utils/truncateHash";
import {
  Flex,
  Stack,
  SimpleGrid,
  chakra,
  Button,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useInkathon } from "@scio-labs/use-inkathon";
import Head from "next/head";
import { useEffect, useState } from "react";

const ViewSuppliers: NextPageWithLayout = () => {
  const { activeAccount } = useInkathon();
  const { getAllSuppliers } = useSupplier();
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");

  const fetchSuppliers = async () => {
    const suppliers = await getAllSuppliers();
    if (suppliers) {
      setSuppliers(suppliers);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [activeAccount]);

  console.log(suppliers);
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
            spacingY={4}
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
              Location
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              PhoneNo
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
          {suppliers.length === 0 ? (
            <Text px={50}>No Supplier is listed Yet</Text>
          ) : (
            suppliers?.map((item, pid) => (
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
                      md: 5,
                    }}
                    w="full"
                    py={5}
                    px={10}
                    fontWeight="400"
                  >
                    <chakra.span>{item?.name}</chakra.span>
                    <chakra.span>{truncateHash(item?.address)}</chakra.span>
                    <chakra.span>{item?.location}</chakra.span>
                    <chakra.span>{item?.phoneNo}</chakra.span>
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
                        View Raw Materials
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

ViewSuppliers.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default ViewSuppliers;
