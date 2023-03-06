import CustomFormControl from "@/components/CustomFormControl";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { useState } from "react";
import Head from "next/head";
import {
  Flex,
  useColorModeValue,
  Stack,
  Heading,
  Button,
  Box,
  useToast,
} from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { IToastProps } from "@/types/Toast";
import useSupplier from "@/hooks/useSupplier";
import { ISupplier, SupplierStatus } from "@/types/Supplier";
import { nanoid } from "nanoid";
import { useInkathon } from "@scio-labs/use-inkathon";

const AddSupplier: NextPageWithLayout = () => {
  const toast = useToast();
  const { activeAccount, isConnected } = useInkathon();
  const { saveSupplier } = useSupplier();
  const [name, setName] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const resetFields = () => {
    setName("");
    setEmail("");
    setPhoneNo("");
    setLocation("");
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

    if (!location) {
      customToast({
        title: "Location is required",
        description: "Please enter the location of the supplier",
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

    try {
      setLoading(true);

      const supplier: ISupplier = {
        name,
        phoneNo,
        email,
        location,
        invitelink: `http://localhost:3000/join/supplier/${nanoid(10)}`,
        created: new Date(),
        updated: new Date(),
        manufacturer_address: activeAccount?.meta?.name || "",
        manufacturer_name: activeAccount?.address || "",
        status: SupplierStatus.Pending,
      };

      const res = await saveSupplier(supplier);

      if (res.status === "ok") {
        customToast({
          title: "Supplier added successfully",
          description: "Supplier added successfully",
          status: "success",
        });
        resetFields();
      } else {
        customToast({
          title: "Error adding supplier",
          description: res.msg,
          status: "error",
        });
      }
    } catch (err) {
      console.log("err on add-supplier.tsx", err);
      customToast({
        title: "Error adding supplier",
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
        <title>AgriTrace | Add Supplier</title>
      </Head>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Add New Supplier to Ecosystem
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
              labelText="Name of Supplier"
              placeholder="Muthauti Dairy Cooperative"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
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
                Add Supplier
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

AddSupplier.getLayout = (page) => (
  <ManufacturerLayout>{page}</ManufacturerLayout>
);

export default AddSupplier;
