import { ReactNode, useEffect, useState } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import AuthLayout from "@/layouts/AuthLayout";
import useTransaction from "@/hooks/useTransaction";
import TraceResults from "@/components/TraceResults";
import {
  Box,
  Button,
  chakra,
  Flex,
  GridItem,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Stack,
  VisuallyHidden,
} from "@chakra-ui/react";
import {
  contractQuery,
  unwrapResultOrDefault,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";
import { toast } from "react-hot-toast";
import {
  IBacktrace,
  IEntity,
  IProductSale,
  IStakeholderInfo,
} from "@/types/Transaction";
import { testFetchBackTrace } from "@/utils/utils";
import { IDistributor } from "@/types/Distributor";
import { IManufacturer } from "@/types/Manufacturer";
import { ISupplier } from "@/types/Supplier";

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

const TraceInfo: NextPageWithLayout = () => {
  const { testBackTrace, getAllStakeholderInfo } = useTransaction();
  const [traceInfo, setTraceInfo] = useState<IBacktrace>();
  const [stakeholderInfo, setStakeholderInfo] = useState<IStakeholderInfo>();
  const [serialNo, setSerialNo] = useState<string>();
  const { activeSigner, api, activeAccount } = useInkathon();
  const { contract: transactionContract } = useRegisteredContract(
    ContractID.Transactions
  );

  const fetchTraceBack = async () => {
    if (!activeAccount || !activeSigner || !api || !transactionContract) {
      toast.error("Please connect to your wallet");
      return;
    }

    const id = toast.loading("Fetching Trace Back Info...");

    if (transactionContract && api && activeAccount) {
      // toast for querying products
      toast.loading("Validating Serial No 🕵🏽...", { id });
      const product_results = await contractQuery(
        api,
        activeAccount.address,
        transactionContract,
        "getAllProductTransactions",
        {}
      );

      const product_transactions = unwrapResultOrDefault(
        product_results,
        [] as IProductSale[]
      );

      // checking if serial no exists
      const serial_no_exists = product_transactions.some(
        (product) => product.serialNo === serialNo
      );

      if (!serial_no_exists) {
        toast.error("Serial No does not exist", { id });
        return;
      }

      // get entities
      const entity_results = await contractQuery(
        api,
        activeAccount.address,
        transactionContract,
        "getAllTransactions",
        {}
      );

      toast.loading("Getting entities ...", { id });

      const entity_transactions = unwrapResultOrDefault(
        entity_results,
        [] as IEntity[]
      );

      // get backtrace info

      const backtrace_results = testFetchBackTrace(
        product_transactions,
        entity_transactions,
        serialNo
      );

      setTraceInfo(backtrace_results);

      toast.success("Backtrace info fetched successfully", { id });

      // get stakeholder info
      const stakeholder_results = await getAllStakeholderInfo(
        backtrace_results.productTransaction.buyer,
        backtrace_results.productTransaction.seller,
        backtrace_results.entityTransactions[0].seller
      );

      setStakeholderInfo(stakeholder_results);

      toast.success("Stakeholder info fetched successfully", { id });
    }
  };

  useEffect(() => {
    testBackTrace();
  }, []);

  console.log("traceInfo", traceInfo);
  console.log("stakeholderInfo", stakeholderInfo);

  return (
    <>
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
                onChange={(e) => setSerialNo(e.target.value)}
                value={serialNo}
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
              onClick={fetchTraceBack}
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
      {traceInfo && (
        <Box>
          <Heading textAlign={"center"} py={5}>
            Trace results for serial no: {serialNo}
          </Heading>
          <TraceResults
            serial_no={serialNo}
            backtraceInfo={traceInfo}
            stakeholderInfo={stakeholderInfo}
          />
        </Box>
      )}
    </>
  );
};

TraceInfo.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default TraceInfo;
