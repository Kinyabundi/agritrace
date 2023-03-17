import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import {
  Button,
  chakra,
  Divider,
  Flex,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  IEntity,
  IProductSale,
  TransactionStatus,
  transactionStatusArray,
} from "@/types/Transaction";
import { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { truncateHash } from "@/utils/truncateHash";
import {
  useInkathon,
  useRegisteredContract,
  contractTx,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";
import { IToastProps } from "@/types/Toast";
import { toast as loadingToast } from "react-hot-toast";
import DistributorLayout from "@/layouts/DistributorLayout";
import useDistributor from "@/hooks/useDistributor";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const IncomingProducts: NextPageWithLayout = () => {
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const toast = useToast();

  const { getIncomingProducts } = useDistributor();
  const { activeAccount, activeSigner, api } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Transactions);

  const [products, setProducts] = useState<IProductSale[]>([]);

  const fetchProducts = async () => {
    const incoming_products = await getIncomingProducts();
    if (incoming_products) {
        setProducts(incoming_products);
    }
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

  const acceptProduct = async (productCode: string) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      return customToast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
        status: "error",
      });
    }

    const toastId = loadingToast.loading("Accepting incoming raw material...");

    try {
      api.setSigner(activeSigner);
      await contractTx(
        api,
        activeAccount.address,
        contract,
        "purchase",
        {},
        [productCode],
        ({ status }) => {
          if (status.isInBlock) {
            loadingToast.success("Raw material accepted", { id: toastId });
            fetchProducts();
          }
        }
      );
    } catch (err) {
      console.log(err);
      loadingToast.error("Error accepting raw material", { id: toastId });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeAccount]);
  console.log(products)

  return (
    <>
      <Head>
        <title>AgriTrace | Products</title>
      </Head>

      <Flex w="full" align={"center"} justify={"space-between"}>
        <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
          Incoming Products
        </Text>
        <Select
          size={"md"}
          w={"52"}
          placeholder={"Transaction Status"}
          defaultValue={TransactionStatus.Initiated}
        >
          {transactionStatusArray.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Flex>

      <Stack
        direction={{
          base: "column",
        }}
        w="full"
        bg={{
          md: bg,
        }}
        shadow="lg"
      >
        <SimpleGrid
          spacingY={3}
          columns={{
            base: 1,
            md: 8,
          }}
          w={{
            base: 120,
            md: "full",
          }}
          textTransform="uppercase"
          bg={bg2}
          color={"gray.800"}
          py={{
            base: 1,
            md: 4,
          }}
          px={{
            base: 2,
            md: 10,
          }}
          fontSize="md"
          fontWeight="hairline"
        >
          <chakra.span color="blue.800" fontWeight="600">
            Product Code
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Quantity
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Status
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Serial No
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Created
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Updated
          </chakra.span>
          <chakra.span color="blue.800" fontWeight="600">
            Seller
          </chakra.span>
          <chakra.span
            color="blue.800"
            fontWeight="600"
            textAlign={{
              md: "right",
            }}
          >
            Actions
          </chakra.span>
        </SimpleGrid>
        {products.length > 0 ? (
          products.map((product) => (
            <>
              <Flex
                direction={{
                  base: "row",
                  md: "column",
                }}
                bg={dataColor}
                key={product.serialNo}
                align={"center"}
              >
                <SimpleGrid
                  spacingY={3}
                  columns={{
                    base: 1,
                    md: 8,
                  }}
                  w="full"
                  py={2}
                  px={10}
                  fontWeight="400"
                  fontSize="sm"
                >
                  <chakra.span color="blue.800" fontWeight="600">
                    {product.productCode}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {product.quantity} {product.quantityUnit}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {product.status}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {product.batchNo}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {timeAgo.format(new Date(product.createdAt))}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {timeAgo.format(new Date(product.updatedAt))}
                  </chakra.span>
                  <chakra.span color="blue.800" fontWeight="600">
                    {truncateHash(product.seller)}
                  </chakra.span>
                  <VStack
                    justify={{
                      md: "end",
                    }}
                    align={{
                      md: "end",
                    }}
                  >
                    <div>
                      {product.status === TransactionStatus.Completed && (
                        <Button variant="solid" colorScheme="teal" size="sm">
                          Completed
                        </Button>
                      )}
                      {product.status === TransactionStatus.Initiated && (
                        <Button
                          variant="solid"
                          colorScheme="teal"
                          size="sm"
                          onClick={() => acceptProduct(product.productCode)}
                        >
                          Accept
                        </Button>
                      )}

                      {product.status === TransactionStatus.InProgress && (
                        <Button variant="solid" colorScheme="teal" size="sm">
                          In Progress
                        </Button>
                      )}
                    </div>

                    <div>
                      {product.status === TransactionStatus.Initiated && (
                        <Button
                          variant="solid"
                          colorScheme="red"
                          size="sm"
                          isDisabled={product.status !== "Initiated"}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </VStack>
                </SimpleGrid>
              </Flex>
              <Divider />
            </>
          ))
        ) : (
          <Flex
            w="full"
            align={"center"}
            justify={"center"}
            bg={dataColor}
            py={10}
          >
            <Text fontSize={"2xl"} fontWeight={"semibold"}>
              No Incoming Products
            </Text>
          </Flex>
        )}
      </Stack>
    </>
  );
};

IncomingProducts.getLayout = (page) => (
  <DistributorLayout>{page}</DistributorLayout>
);

export default IncomingProducts;
