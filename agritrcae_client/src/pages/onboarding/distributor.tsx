import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import AuthLayout from "@/layouts/AuthLayout";
import CustomFormControl from "@/components/CustomFormControl";
import { IToastProps } from "@/types/Toast";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";
import { useRouter } from "next/router";

const OnboardingDistributor: NextPageWithLayout = () => {
  const toast = useToast();
  const { activeSigner, api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.StakeholderRegistry);
  const [phoneno, setPhoneno] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const resetFields = () => {
    setName("");
    setLocation("");
    setPhoneno("");
    setEmail("");
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

    if (!email) {
      return customToast({
        title: "Email is required",
        description: "Please enter an email",
        status: "error",
      });
    }

    if (!phoneno) {
      return customToast({
        title: "Phone number is required",
        description: "Please enter a phone number",
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
        "addDistributor",
        undefined,
        [name, phoneno, email, location],
        (sth) => {
          if (sth?.status.isInBlock) {
            customToast({
              title: "Distributor added",
              description: "Distributor added successfully",
              status: "success",
            });
            setLoading(false);
          }
        }
      );
      resetFields();
      router.push("/");
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
            Create an account to get started with Agritrace as a Distributor
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
              labelText="Name of Distributor"
              placeholder="Enter name of Distributor"
              value={name}
              setValue={setName}
            />

            <CustomFormControl
              labelText="Location"
              placeholder="Enter location"
              value={location}
              setValue={setLocation}
            />
            <CustomFormControl
              labelText="Email"
              placeholder="Enter Email"
              value={email}
              setValue={setEmail}
            />
            <CustomFormControl
              labelText="Phone No"
              placeholder="Enter Phone No"
              value={phoneno}
              setValue={setPhoneno}
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

OnboardingDistributor.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default OnboardingDistributor;
