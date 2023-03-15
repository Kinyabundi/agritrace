import React, { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import useManufacturer from "@/hooks/useManufacturer";
import { IToastProps } from "@/types/Toast";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID, IProduct, IProductSold } from "@/types/Contracts";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { IProductSale } from "@/types/Transaction";
import {
  useColorModeValue,
  Flex,
  Stack,
  SimpleGrid,
  chakra,
  Button,
  Text,
  Divider,
  useToast,
  useInterval,
} from "@chakra-ui/react";
import { generateNumbers } from "@/utils/utils";
import useTransaction from "@/hooks/useTransaction";
import { checkProductInTransactions } from "@/utils/utils";
interface SalesProps {
  productsDetails?: IProductSold;
}
const ViewProducts: NextPageWithLayout = () => {
  const toast = useToast();
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const { getAllProducts } = useTransaction();
  const { activeAccount, activeSigner, api } = useInkathon();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productSale, setProductSale] = useState<IProductSale[]>([]);
  const { getProductsByAddedBy } = useManufacturer();
  const { contract } = useRegisteredContract(ContractID.Transactions);

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



  const InitiateSale = async (
    { productsDetails }: SalesProps
  ) => {
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
      const serialNo = generateNumbers();

      await contractTx(
        api,
        activeAccount.address,
        contract,
        "sellProduct",
        undefined,
        [productsDetails.productCode,
        productsDetails.quantity,
        productsDetails.quantityUnits,
        [productsDetails.rawMaterials],
          "5Dy1SCkxhsGWGSzZoJpGjEvdopwxqZzK5Avn2c5jB2QmueF3",
          serialNo,
        ],
        (sth) => {
          if (sth?.status.isInBlock) {
            customToast({
              title: "Sale intialized",
              description: "Sale intialized successfully",
              status: "success",
            });
            setLoading(false);
          }
        }
      );
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
  }

  useInterval(() => fetchAllProducts(), 3000);

  useEffect(() => {
    fetchProducts();
  }, [activeAccount]);

  const fetchProducts = async () => {
    const items = await getProductsByAddedBy();
    if (items) {
      setProducts(items);
    }
  };
  const fetchAllProducts = async () => {
    const allProducts = await getAllProducts();
    if (allProducts) {
      setProductSale(allProducts);
    }
  };


  console.log(productSale);

  return (
    <>
      <Head>
        <title>AgriTrace | Products </title>
      </Head>
      <Text px={50} fontSize={"2xl"} fontWeight={"semibold"}>
        Products
      </Text>
      <Flex
        w="full"
        bg="#edf3f8"
        _dark={{
          bg: "#3e3e3e",
        }}
        p={50}
        alignItems="center"
        justifyContent="center"
      >

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
              md: 6,
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
              md: 6,
            }}
            px={{
              base: 2,
              md: 10,
            }}
            fontSize="md"
            fontWeight="hairline"
          >
            <chakra.span color="blue.800" fontWeight="600">
              Name
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              ProductCode
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              Quantity
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              RawMaterials
            </chakra.span>
            <chakra.span color="blue.800" fontWeight="600">
              BatchNo
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
          <>
            {products.length === 0 ? (
              <Text px={50}>No Products Added Yet</Text>
            ) : (
              products?.map((item, pid) => (
                <div key={pid}>
                  <Flex
                    direction={{
                      base: "row",
                      md: "column",
                    }}
                    bg={dataColor}
                  >
                    <SimpleGrid
                      spacingY={3}
                      columns={{
                        base: 1,
                        md: 6,
                      }}
                      w="full"
                      py={2}
                      px={10}
                      fontWeight="400"
                    >
                      <chakra.span>{item?.name}</chakra.span>
                      <chakra.span>{item?.productCode}</chakra.span>
                      <chakra.span>{item?.quantity}</chakra.span>
                      <chakra.span>{item?.rawMaterials.join(", ")}</chakra.span>
                      <chakra.span> {item?.batchNo} </chakra.span>
                      <Flex
                        justify={{
                          md: "end",
                        }}
                      >
                        <Button
                          variant="solid"
                          isLoading={loading}
                          loadingText="Initiating sale"
                          colorScheme="red"
                          size="sm"
                          onClick={() => InitiateSale({ productsDetails: item })}
                          isDisabled={checkProductInTransactions(productSale,
                            item.productCode
                          )}
                        >
                          {checkProductInTransactions(
                            productSale,
                            item.productCode
                          )
                            ? "Sold"
                            : "Sell"}
                        </Button>
                      </Flex>
                    </SimpleGrid>
                  </Flex>
                  <Divider />
                </div>
              ))
            )}
          </>
        </Stack >
      </Flex >
    </>
  );
};

ViewProducts.getLayout = (page) => <ManufacturerLayout>{page} </ManufacturerLayout>;

export default ViewProducts;
