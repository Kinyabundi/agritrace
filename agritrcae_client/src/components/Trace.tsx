import {
  Flex,
  Icon,
  chakra,
  SimpleGrid,
  GridItem,
  VisuallyHidden,
  Input,
  Button,
  Stack,
  Box,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface FeatureProps {
  children: ReactNode;
}

const Feature = ({ children }: FeatureProps) => (
  <Flex
    alignItems="center"
    color={null}
    _dark={{
      color: "white",
    }}
  >
    <Icon
      boxSize={4}
      mr={1}
      color="green.600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      ></path>
    </Icon>
    {children}
  </Flex>
);

const Trace = () => {
    

  return (
    <Box px={4} py={32} mx="auto">
      <Box
        w={{
          base: "full",
          md: 11 / 12,
          xl: 8 / 12,
        }}
        textAlign={{
          base: "left",
          md: "center",
        }}
        mx="auto"
      >
        <chakra.h1
          mb={3}
          fontSize={{
            base: "4xl",
            md: "5xl",
          }}
          fontWeight={{
            base: "bold",
            md: "extrabold",
          }}
          color="gray.900"
          _dark={{
            color: "gray.100",
          }}
          lineHeight="shorter"
        >
          AgriTrace Serial No Back Trace
        </chakra.h1>
        {/* Text explaining AgriTrace Serial No Back Trace for Products in supply chain using blockchain technology */}
        <chakra.p
          mb={6}
          fontSize={{
            base: "lg",
            md: "xl",
          }}
          color="gray.500"
          lineHeight="base"
        >
          AgriTrace Serial No Back Trace for Products in supply chain using
          blockchain technology
        </chakra.p>
        <SimpleGrid
          as="form"
          w={{
            base: "full",
            md: 7 / 12,
          }}
          columns={{
            base: 1,
            lg: 6,
          }}
          spacing={3}
          pt={1}
          mx="auto"
          mb={8}
        >
          <GridItem
            as="label"
            colSpan={{
              base: "auto",
              lg: 4,
            }}
          >
            <VisuallyHidden>Enter Serial to Do Trace back</VisuallyHidden>
            <Input
              mt={0}
              size="lg"
              placeholder="Enter Serial No to Do Trace back"
              required
            />
          </GridItem>
          <Button
            as={GridItem}
            w="full"
            variant="solid"
            colSpan={{
              base: "auto",
              lg: 2,
            }}
            size="lg"
            type="submit"
            colorScheme="teal"
            cursor="pointer"
          >
            Trace
          </Button>
        </SimpleGrid>
        <Stack
          display="flex"
          direction={{
            base: "column",
            md: "row",
          }}
          justifyContent={{
            base: "start",
            md: "center",
          }}
          mb={3}
          spacing={{
            base: 2,
            md: 8,
          }}
          fontSize="xs"
          color="gray.600"
        >
          <Feature>
            <chakra.span fontWeight="bold">100%</chakra.span> Secure
          </Feature>
          <Feature>
            <chakra.span fontWeight="bold">100%</chakra.span> Traceable
          </Feature>
          <Feature>
            <chakra.span fontWeight="bold">100%</chakra.span> Transparent
          </Feature>
        </Stack>
      </Box>
    </Box>
  );
};

export default Trace;
