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
import { IToastProps } from "@/types/Toast";

const OnboardingSupplier: NextPageWithLayout = () => {
  const toast = useToast();
  const [name, setName] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>("")

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

  const handleSubmit = async () => {};

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
