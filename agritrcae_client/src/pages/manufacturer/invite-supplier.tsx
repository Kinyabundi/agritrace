import CustomFormControl from "@/components/CustomFormControl";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import {
  Flex,
  useColorModeValue,
  Stack,
  Heading,
  Button,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useInkathon } from "@scio-labs/use-inkathon";
import { IToastProps } from "@/types/Toast";
import Head from "next/head";
import { IInviteBody, InviteTarget } from "@/types/Supplier";
import { nanoid } from "nanoid";
import useInvite from "@/hooks/useInvite";

const InviteSupplier: NextPageWithLayout = () => {
  const toast = useToast();
  const { activeAccount, isConnected } = useInkathon();
  const { sendInvite } = useInvite();
  const [name, setName] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
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

  const resetFields = () => {
    setEmail("");
    setPhoneNo("");
  };
  const handleSubmit = async () => {
    // kenya phoneno regex
    const phoneNoRegex = /^(\+254|0)[7][0-9]{8}$/;
    // email regex the best one
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!name) {
      customToast({
        title: "Name is required",
        description: "Please enter the name of the supplier",
        status: "error",
      });
      return;
    }

    if (!phoneNo) {
      customToast({
        title: "Phone number is required",
        description: "Please enter the phone number of the supplier",
        status: "error",
      });
      return;
    }

    if (!phoneNoRegex.test(phoneNo)) {
      customToast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        status: "error",
      });
      return;
    }

    if (!email) {
      customToast({
        title: "Email is required",
        description: "Please enter the email of the supplier",
        status: "error",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      customToast({
        title: "Invalid email",
        description: "Please enter a valid email",
        status: "error",
      });
      return;
    }

    if (!isConnected) {
      customToast({
        title: "Wallet not connected",
        description: "Please connect to your wallet",
        status: "error",
      });
      return;
    }

    const inviteInfo: IInviteBody = {
      name,
      phoneno: phoneNo,
      email: email ? email : "",
      company: activeAccount?.meta?.name || "",
      target: InviteTarget.Supplier,
      inviteCode: nanoid(),
      sender: activeAccount?.address || "",
    };

    try {
      setLoading(true);
      const resp = await sendInvite(inviteInfo);
      if (resp?.status === "ok") {
        customToast({
          title: "Invite sent",
          description: "Invite sent successfully",
          status: "success",
        });
      } else {
        customToast({
          title: "Invite not sent",
          description: "Invite not sent successfully",
          status: "error",
        });
      }
    } catch (err) {
      console.log(err);
      customToast({
        title: "Invite not sent",
        description: "Something went wrong",
        status: "error",
      });
    } finally {
      setLoading(false);
    }

    resetFields();
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Head>
        <title>AgriTrace | Invite Supplier</title>
      </Head>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Send an Invite To Supplier
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
              labelText="Supplier Name"
              placeholder="Muthaiti Suppliers"
              value={name}
              setValue={setName}
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
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Sending ..."
                size="lg"
                bg={"cyan.400"}
                color={"white"}
                _hover={{
                  bg: "cyan.500",
                }}
                leftIcon={<FiEdit3 />}
                isLoading={loading}
                onClick={handleSubmit}
              >
                Invite Supplier
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

InviteSupplier.getLayout = (page) => (
  <ManufacturerLayout>{page}</ManufacturerLayout>
);

export default InviteSupplier;
