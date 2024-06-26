import TraceResults from "@/components/TraceResults";
import useTransaction from "@/hooks/useTransaction";
import AuthLayout from "@/layouts/AuthLayout";
import { ContractID, IRawMaterial } from "@/types/Contracts";
import { NextPageWithLayout } from "@/types/Layout";
import {
  IBacktrace,
  IEntity,
  IProductItem,
  IProductSale,
  IStakeholderInfo,
} from "@/types/Transaction";
import { testFetchBackTrace } from "@/utils/utils";
import {
  Box,
  chakra,
  Flex,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import {
  contractQuery,
  unwrapResultOrDefault,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

const Trace: NextPageWithLayout = () => {
  const router = useRouter();
  const { api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Transactions);
  const { contract: entityRegistry } = useRegisteredContract(
    ContractID.EntityRegistry
  );
  const { serial_no } = router.query;
  const [traceInfo, setTraceInfo] = useState<IBacktrace>();
  const [productItem, setProductItem] = useState<IProductItem>();
  const [rawMaterials, setRawMaterials] = useState<IRawMaterial[]>([]);
  const [stakeholderInfo, setStakeholderInfo] = useState<IStakeholderInfo>();
  const { getAllStakeholderInfo } = useTransaction();
  const [loading, setLoading] = useState<boolean>(false);

  const [adminAddress, _] = useState<string>(
    "5EBzvf1j5CwKEVmLxKSxGppoTLKHWqfNfXhXjJmHvCvorm1j"
  );

  const fetchTraceBack = async () => {
    console.log("Am in");
    if (!api || !contract || !activeAccount) {
      return;
    }

    const id = toast.loading("Fetching Trace Back Info...");

    if (contract && api && activeAccount) {
      setLoading(true);
      try {
        // toast for querying products
        toast.loading("Validating Serial No 🕵🏽...", { id });
        const product_results = await contractQuery(
          api,
          adminAddress,
          contract,
          "getAllProductTransactions",
          {}
        );

        const product_transactions = unwrapResultOrDefault(
          product_results,
          [] as IProductSale[]
        );

        // checking if serial no exists
        const serial_no_exists = product_transactions.some(
          (product) => product.serialNo === (serial_no as string)
        );

        if (!serial_no_exists) {
          toast.error("Serial No does not exist", { id });
          return;
        }

        // get entities
        const entity_results = await contractQuery(
          api,
          adminAddress,
          contract,
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
          serial_no as string
        );

        setTraceInfo(backtrace_results);

        toast.success("Backtrace info fetched successfully", { id });

        // toast for getting product info
        toast.loading("Getting product info ...", { id });

        // get product info
        const product_details = await contractQuery(
          api,
          adminAddress,
          entityRegistry,
          "getProduct",
          {},
          [backtrace_results.productTransaction.productCode]
        );

        const product_item = unwrapResultOrDefault(
          product_details,
          {} as IProductItem
        );

        setProductItem(product_item);

        // toast for getting raw materials info
        toast.loading("Getting raw materials info ...", { id });

        // get raw materials info
        const raw_materials_results = await contractQuery(
          api,
          adminAddress,
          entityRegistry,
          "getEntitiesByBatchNos",
          {},
          [product_item.rawMaterials]
        );

        const raw_materials = unwrapResultOrDefault(
          raw_materials_results,
          [] as IRawMaterial[]
        );

        setRawMaterials(raw_materials);

        toast.loading("Getting stakeholder info ...", { id });

        // get stakeholder info
        const stakeholder_results = await getAllStakeholderInfo(
          backtrace_results.productTransaction.buyer,
          backtrace_results.productTransaction.seller,
          backtrace_results.entityTransactions[0].seller
        );

        setStakeholderInfo(stakeholder_results);

        toast.success("Stakeholder info fetched successfully", { id });
      } catch (err) {
        toast.error("Error fetching trace back info", { id });
      } finally {
        setLoading(false);
      }
    }
  };

  // fetch the trace back after 3000 onMount to ensure that api and contract are loaded

  useEffect(() => {
    setTimeout(() => {
      fetchTraceBack();
    }, 3000);
  }, [serial_no, activeAccount]);

  return (
    <>
    <Head>
        <title>AgriTrace Serial No Back Trace</title>
    </Head>
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
      {loading ? (
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
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </GridItem>
        </SimpleGrid>
      ) : (
        stakeholderInfo && (
          <Box>
            <Heading textAlign={"center"} py={5}>
              Trace results for serial no: {serial_no as string}
            </Heading>
            <TraceResults
              serial_no={serial_no as string}
              backtraceInfo={traceInfo}
              stakeholderInfo={stakeholderInfo}
              productItem={productItem}
              rawMaterials={rawMaterials}
            />
          </Box>
        )
      )}
    </>
  );
};

Trace.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Trace;
