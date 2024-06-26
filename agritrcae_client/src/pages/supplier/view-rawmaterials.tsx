import { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import SupplierLayout from "@/layouts/SupplierLayout";
import Head from "next/head";
import useRawMaterials from "@/hooks/useRawMaterials";
import useManufacturer from "@/hooks/useManufacturer";
import { IRawMaterial } from "@/types/Contracts";
import { IManufacturer } from "@/types/Manufacturer";
import { IToastProps } from "@/types/Toast";
import {
  contractTx,
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
  useInterval,
} from "@chakra-ui/react";
import { truncateHash } from "@/utils/truncateHash";
import useTransaction from "@/hooks/useTransaction";
import { IEntity } from "@/types/Transaction";
import { checkRawMaterialInTransactions } from "@/utils/utils";
interface SalesProps {
  rawMaterialDetails?: IRawMaterial;
}
const ViewRawMaterials: NextPageWithLayout = () => {
  const toast = useToast();
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const { getRawMaterials } = useRawMaterials();
  const { getManufacturers } = useManufacturer();
  const { activeSigner, api, activeAccount } = useInkathon();
  const { getAllEntities } = useTransaction();
  const [loading, setLoading] = useState<boolean>(false);
  const [rawMaterials, setRawMaterials] = useState<IRawMaterial[]>([]);
  const { contract } = useRegisteredContract(ContractID.Transactions);
  const [manufacturers, setManufacturers] = useState<IManufacturer[]>([]);
  const [entities, setAllEntities] = useState<IEntity[]>([]);
 

  // const [selectedRawMaterial, setSelectedRawMaterial] =
  //   useState<IRawMaterial>(null);

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

  // const triggerModal = (rawMaterial: IRawMaterial) => {
  //   setSelectedRawMaterial(rawMaterial);
  //   setShowModal(true);
  // };

  const clickInitiateSale = async ({ rawMaterialDetails }: SalesProps) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      return customToast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
        status: "error",
      });
    }
    try {
      setLoading(true);
      api.setSigner(activeSigner);

      await contractTx(
        api,
        activeAccount.address,
        contract,
        "initiateSell",
        undefined,
        [
          rawMaterialDetails.entityCode,
          rawMaterialDetails.quantity,
          rawMaterialDetails.quantityUnit,
          rawMaterialDetails.batchNo,
          rawMaterialDetails.buyer,
        ],
        (sth) => {
          if (sth?.status.isInBlock) {
            customToast({
              title: "Sale intialized",
              description: "Sale intialized successfully",
              status: "success",
            });
            setLoading(false);
          }
        }
      );
    } catch (err) {
      console.log(err);
      customToast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    const items = await getRawMaterials();
    if (items) {
      setRawMaterials(items);
    }
  };

  useInterval(() => fetchAllEntities(), 3000);

  useEffect(() => {
    fetchItems();
    fetchManufacturers();
  }, [activeAccount]);

  const fetchManufacturers = async () => {
    const manufacturers = await getManufacturers();
    if (manufacturers) {
      setManufacturers(manufacturers);
    }
  };

  const fetchAllEntities = async () => {
    const allEntities = await getAllEntities();
    if (allEntities) {
      setAllEntities(allEntities);
    }
  };

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
          <>
            {rawMaterials.length === 0 ? (
              <Text px={50}>No Raw Materials Added Yet</Text>
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
                        md: 6,
                      }}
                      w="full"
                      py={2}
                      px={10}
                      fontWeight="400"
                    >
                      <chakra.span>{item?.name}</chakra.span>
                      <chakra.span>{item?.entityCode}</chakra.span>
                      <chakra.span>{item?.quantity}</chakra.span>
                      <chakra.span>{item?.batchNo}</chakra.span>
                      <chakra.span>{truncateHash(item?.buyer)}</chakra.span>
                      <Flex
                        justify={{
                          md: "end",
                        }}
                      >
                        <Button
                          variant="solid"
                          isLoading={loading}
                          loadingText="Initiating sale"
                          colorScheme="red"
                          size="sm"
                          onClick={() =>
                            clickInitiateSale({ rawMaterialDetails: item })
                          }
                          isDisabled={checkRawMaterialInTransactions(
                            entities,
                            item.batchNo
                          )}
                        >
                          {checkRawMaterialInTransactions(
                            entities,
                            item.batchNo
                          )
                            ? "Sold"
                            : "Sell"}
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

ViewRawMaterials.getLayout = (page) => <SupplierLayout>{page} </SupplierLayout>;

export default ViewRawMaterials;
