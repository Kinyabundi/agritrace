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
import useInvite from "@/hooks/useInvite";
import { ContractID } from "@/types/Contracts";

const OnboardingSupplier: NextPageWithLayout = () => {
  const { activeAccount, activeSigner, api } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.StakeholderRegistry);
  const { getInviteInfo } = useInvite();
  const toast = useToast();
  const [name, setName] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>("");

  const resetFields = () => {
    setName("");
    setPhoneNo("");
    setEmail("");
    setLocation("");
    setInviteCode("");
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
    // kenya phoneno regex
    const phoneNoRegex = /^(\+254|0)[7][0-9]{8}$/;
    // email regex the best one
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // validate fields
    

    if (phoneNo && !phoneNoRegex.test(phoneNo)) {
      customToast({
        title: "Error",
        description: "Invalid phone number",
        status: "error",
      });
      return;
    }

    if (email && !emailRegex.test(email)) {
      customToast({
        title: "Email Required",
        description: "Please fill in a valid email address",
        status: "error",
      });
      return;
    }

    if (!activeAccount || !contract || !api || !activeSigner) {
      customToast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
        status: "error",
      });
      return;
    }

    try {
      setLoading(true);
      api.setSigner(activeSigner);
      
      await contractTx(
        api,
        activeAccount.address,
        contract,
        "saveSupplier",
        {},
        [name, phoneNo, email]
      );

      customToast({
        status: "success",
        title: "Onboard success",
        description: "We've successfully onboarded your wallet as supplier",
      });
      
    } catch (err) {
      console.log(err);
      customToast({
        status: "error",
        title: "Error",
        description: "An error was encontered",
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
            Create an account to get started with Agritrace as a Supplier
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
              labelText="Supplier Name"
              placeholder={"Muthaiti Dairy Cooperative"}
            />
            <CustomFormControl
              labelText="Phone No"
              placeholder="0712345678"
              value={phoneNo}
              setValue={setPhoneNo}
            />
            <CustomFormControl
              labelText="Email"
              placeholder="muthaiti@gmail.com"
              value={email}
              setValue={setEmail}
            />
            <CustomFormControl
              labelText="Location"
              placeholder="Muthaiti, Kiambu County"
              value={location}
              setValue={setLocation}
            />
            <CustomFormControl
              labelText="Invite Code"
              placeholder="Enter invite code"
              value={inviteCode}
              setValue={setInviteCode}
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

OnboardingSupplier.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default OnboardingSupplier;
