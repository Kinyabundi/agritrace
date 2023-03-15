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
import Head from "next/head";
import { FiEdit3 } from "react-icons/fi";
import { NextPageWithLayout } from "@/types/Layout";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { useState, useEffect } from "react";
import { IToastProps } from "@/types/Toast";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID} from "@/types/Contracts";
import useRawMaterials from "@/hooks/useRawMaterials";
import { concatRawMaterials, generateNumbers } from "@/utils/utils";


const AddProduct: NextPageWithLayout = () => {
  const { activeSigner, api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(
    ContractID.EntityRegistry
  );
  const toast = useToast();
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [quantityUnits, setQuantityUnits] = useState<string>("");
  const [productCode, setProductCode] = useState<string>("");
  const [batchNo, setBatchNo] = useState<number>(0);
  const { getRawMaterialsByBuyer} = useRawMaterials();
  const [selectRawMaterials, setSelectRawMaterials] = useState<string>("")
 const [rawMaterials, setRawMaterials] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    fetchrawMaterials();
  }, [activeAccount]);

  const fetchrawMaterials = async () => {
    const items = await getRawMaterialsByBuyer();
    if (items) {
      setRawMaterials(items);
    }
  };
 

console.log(rawMaterials)


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

    if (!productCode) {
      customToast({
        title: "Product Code is required",
        description: "Please enter the product code of the product",
        status: "error",
      });
      return;
    }

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
        "addProduct",
        undefined,
        [
          name,
          productCode,
          quantity,
          quantityUnits,
          batchNo,
          selectRawMaterials,
        ],
        (sth) => {
          if (sth?.status.isInBlock) {
            customToast({
              title: "Product added",
              description: "product added successfully",
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
        <title>AgriTrace | Add Product</title>
      </Head>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Add New Product to Ecosystem
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
              labelText="Name of Product"
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
              labelText="ProductCode"
              placeholder="233232"
              value={productCode}
              setValue={setProductCode}
            />
              <CustomFormControl
            labelText="Select RawMaterial Used"
            variant="select"
            options={rawMaterials ?  concatRawMaterials(rawMaterials) : []}
            onChange={(e) => setSelectRawMaterials(e.target.value)}
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
              >
                Add Product
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
AddProduct.getLayout = (page) => (
  <ManufacturerLayout>{page}</ManufacturerLayout>
);
export default AddProduct;
