import CustomFormControl from "@/components/CustomFormControl";
import {
  Flex,
  useColorModeValue,
  Stack,
  Heading,
  Button,
  Box,
  useToast,
} from "@chakra-ui/react";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import Head from "next/head";
import { FiEdit3 } from "react-icons/fi";
import React, { useState } from "react";
import { IToastProps } from "@/types/Toast";
import { NextPageWithLayout } from "@/types/Layout";
import SupplierLayout from "@/layouts/SupplierLayout";
import { ContractID } from "@/types/Contracts";

const AddRawMaterial: NextPageWithLayout = () => {
  const { contract } = useRegisteredContract(ContractID.EntityRegistry);
  const { activeSigner, api, activeAccount } = useInkathon();
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [quantityUnits, setQuantityUnits] = useState<string>("");
  const [batchNo, setBatchNo] = useState<number>(0);
  const [entityCode, setEntityCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

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

  const handleSubmit = async () => {
    if (!name) {
      customToast({
        title: "Name is required",
        description: "Please enter the name of the product",
        status: "error",
      });
      return;
    }

    if (!quantity) {
      customToast({
        title: "Quantity is required",
        description: "Please enter the quantity of the product",
        status: "error",
      });
      return;
    }

    if (!quantityUnits) {
      customToast({
        title: "Quantity Units is required",
        description: "Please enter the quantity units of the product",
        status: "error",
      });
      return;
    }

    if (!entityCode) {
      customToast({
        title: "Product Code is required",
        description: "Please enter the product code of the product",
        status: "error",
      });
      return;
    }
    // const RawMaterialInfo: IRawMaterial = {
    //   name,
    //   quantity,
    //   quantityUnits,
    //   entityCode,
    //   batchNo: 8826669933,
    // }
    //check if wallet is connected
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
        "addEntity",
        undefined,
        [
          name,
          quantity,
          quantityUnits,
          entityCode,
          batchNo,
          "5Dy1SCkxhsGWGSzZoJpGjEvdopwxqZzK5Avn2c5jB2QmueF3",
        ],
        (sth) => {
          if (sth?.status.isInBlock) {
            customToast({
              title: "Raw Material added",
              description: "Raw Material added successfully",
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

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Head>
        <title>AgriTrace | Add RawMaterial</title>
      </Head>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Add New RawMaterial to Ecosystem
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <CustomFormControl
              labelText="Name of RawMaterial"
              placeholder="Milk"
              value={name}
              setValue={setName}
            />
            <CustomFormControl
              labelText="Quantity"
              placeholder="400"
              inputType="number"
              value={quantity}
              // @ts-ignore
              setValue={setQuantity}
            />
            <CustomFormControl
              labelText="Quantity Units"
              placeholder="Kilograms"
              value={quantityUnits}
              setValue={setQuantityUnits}
            />
            <CustomFormControl
              labelText="EntityCode"
              placeholder="233232"
              value={entityCode}
              setValue={setEntityCode}
            />
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                onClick={handleSubmit}
                size="lg"
                bg={"cyan.400"}
                color={"white"}
                _hover={{
                  bg: "cyan.500",
                }}
                leftIcon={<FiEdit3 />}
                isLoading={loading}
              >
                Add RawMaterialCode
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
AddRawMaterial.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>;
export default AddRawMaterial;
