import {
  Flex,
  Box,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import AuthLayout from "@/layouts/AuthLayout";
import CustomFormControl from "@/components/CustomFormControl";
import { CgTrash } from "react-icons/cg";
import { IToastProps } from "@/types/Toast";
import {
  contractQuery,
  contractTx,
  unwrapResultOrError,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";

const OnboardingManufacturer: NextPageWithLayout = () => {
  const toast = useToast();
  const { activeSigner, api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.StakeholderRegistry);
  const [phonenos, setPhonenos] = useState<string[]>([""]);
  const [products, setProducts] = useState<string[]>([""]);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [corporateNo, setCorporateNo] = useState<string>("");

  const handleAddNewPhoneNo = () => {
    setPhonenos([...phonenos, ""]);
  };

  const handleRemovePhoneNo = (index: number) => {
    const newPhonenos = phonenos.filter((_, i) => i !== index);
    setPhonenos(newPhonenos);
  };

  const handlePhoneNoChange = (e: any, index: number) => {
    const { value } = e.target;
    const newPhonenos = [...phonenos];
    newPhonenos[index] = value;
    setPhonenos(newPhonenos);
  };

  const handleAddNewProduct = () => {
    setProducts([...products, ""]);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleProductChange = (e: any, index: number) => {
    const { value } = e.target;
    const newProducts = [...products];
    newProducts[index] = value;
    setProducts(newProducts);
  };

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
    //Validate
    if (!name) {
      return customToast({
        title: "Name is required",
        description: "Please enter a name",
        status: "error",
      });
    }
    if (!location) {
      return customToast({
        title: "Location is required",
        description: "Please enter a location",
        status: "error",
      });
    }
    if (!corporateNo) {
      return customToast({
        title: "Corporate No is required",
        description: "Please enter a corporate no",
        status: "error",
      });
    }
    if (phonenos.filter((item) => item !== "").length === 0) {
      return customToast({
        title: "Phone No is required",
        description: "Please enter atleast one phone no",
        status: "error",
      });
    }
    if (products.filter((item) => item !== "").length === 0) {
      return customToast({
        title: "Product is required",
        description: "Please enter atleast one product",
        status: "error",
      });
    }

    // check if wallet is connected
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
        "addManufacturer",
        undefined,
        [name, corporateNo, phonenos, products, location],
        (sth) => {
          if (sth?.status.isInBlock) {
            customToast({
              title: "Manufacturer added",
              description: "Manufacturer added successfully",
              status: "success",
            });
            setLoading(false);
          }
        }
      )
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
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Get Started
          </Heading>
          <Text textAlign={"center"}>
            Create an account to get started with Agritrace as a Manufacturer
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <CustomFormControl
              labelText="Name of Manufacturer"
              placeholder="Enter name of manufacturer"
              value={name}
              setValue={setName}
            />
            <CustomFormControl
              labelText="Corporate No"
              placeholder="Enter corporate number"
              value={corporateNo}
              setValue={setCorporateNo}
            />
            {phonenos.map((phone, i) => (
              <div key={i}>
                <HStack>
                  <CustomFormControl
                    labelText="Phone No"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => handlePhoneNoChange(e, i)}
                  />
                  {phonenos.length > 1 && (
                    <IconButton
                      onClick={() => handleRemovePhoneNo(i)}
                      colorScheme="red"
                      variant="outline"
                      aria-label={"Remove"}
                      icon={<CgTrash />}
                    />
                  )}
                </HStack>
                <hr
                  style={{
                    backgroundColor: "#CBD5E0",
                    color: "#CBD5E0",
                    height: 2,
                    marginBottom: 6,
                  }}
                />
              </div>
            ))}
            <Button
              onClick={handleAddNewPhoneNo}
              colorScheme="blue"
              variant="outline"
            >
              Add New Phone No
            </Button>
            {products.map((product, i) => (
              <div key={i}>
                <HStack>
                  <CustomFormControl
                    labelText="Product"
                    placeholder="Enter product"
                    value={product}
                    onChange={(e) => handleProductChange(e, i)}
                  />
                  {products.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveProduct(i)}
                      colorScheme="red"
                      variant="outline"
                      aria-label={"Remove"}
                      icon={<CgTrash />}
                    />
                  )}
                </HStack>
                <hr
                  style={{
                    backgroundColor: "#CBD5E0",
                    color: "#CBD5E0",
                    height: 2,
                    marginBottom: 6,
                  }}
                />
              </div>
            ))}
            <Button
              onClick={handleAddNewProduct}
              colorScheme="blue"
              variant="outline"
            >
              Add New Product
            </Button>
            <CustomFormControl
              labelText="Location"
              placeholder="Enter location"
              value={location}
              setValue={setLocation}
            />
            <Button
              bg={"cyan.400"}
              color={"white"}
              _hover={{
                bg: "cyan.500",
              }}
              type="submit"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Submitting ..."
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

OnboardingManufacturer.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default OnboardingManufacturer;
