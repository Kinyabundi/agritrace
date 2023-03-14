import { useAsPath } from "@/hooks/store/useAsPath";
import { Flex, chakra, HStack, Button, Box, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";

const NotFoundPage = () => {
  const { prevAsPath } = useAsPath();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>404 - Agritrcae</title>
      </Head>
      <Flex px={4} py={32} mx="auto">
        <Box
          mx="auto"
          w={{
            lg: 8 / 12,
            xl: 5 / 12,
          }}
        >
          <chakra.p
            mb={2}
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wide"
            color="gray.400"
            textTransform="uppercase"
          >
            404 error
          </chakra.p>
          <chakra.h1
            mb={3}
            fontSize={{
              base: "3xl",
              md: "4xl",
            }}
            fontWeight="bold"
            lineHeight="shorter"
            color="gray.900"
            _dark={{
              color: "white",
            }}
          >
            We can&apos;t find that page
          </chakra.h1>
          <Text
            mb={5}
            color="gray.500"
            fontSize={{
              md: "lg",
            }}
          >
            Sorry, the page you are looking for doesn't exist or has been moved.
          </Text>
          <HStack>
            <Button
              as="a"
              w={{
                base: "full",
                sm: "auto",
              }}
              variant="outline"
              size="lg"
              mb={{
                base: 2,
                sm: 0,
              }}
              cursor="pointer"
              leftIcon={<BsArrowLeft />}
              onClick={() => router.push(prevAsPath ? prevAsPath : "/")}
            >
              Go back
            </Button>
            <Button
              as="a"
              w={{
                base: "full",
                sm: "auto",
              }}
              mb={{
                base: 2,
                sm: 0,
              }}
              size="lg"
              cursor="pointer"
              colorScheme="teal"
              onClick={() => router.push("/")}
            >
              Take Me Home
            </Button>
          </HStack>
        </Box>
      </Flex>
    </>
  );
};

export default NotFoundPage;
