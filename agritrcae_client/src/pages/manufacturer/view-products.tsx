import { useState, useEffect } from "react";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import useManufacturer from "@/hooks/useManufacturer";
import { useInkathon } from "@scio-labs/use-inkathon";
import { IProduct, IProductSold } from "@/types/Contracts";
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
  useInterval,
} from "@chakra-ui/react";
import { validateProductStatus } from "@/utils/utils";
import useTransaction from "@/hooks/useTransaction";
import SaleModal from "@/components/SaleModal";

const ViewProducts: NextPageWithLayout = () => {
  const dataColor = useColorModeValue("white", "gray.800");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");
  const { getAllProducts } = useTransaction();
  const { activeAccount } = useInkathon();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productSale, setProductSale] = useState<IProductSale[]>([]);
  const { getProductsByAddedBy } = useManufacturer();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productSold, setProductSold] = useState<IProductSold | IProduct>();

  const triggerModal = (item: IProductSold | IProduct) => {
    setProductSold(item);
    setShowModal(true);
  };

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
      <SaleModal
        open={showModal}
        setOpen={setShowModal}
        productsDetails={productSold}
      />
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
                          colorScheme="teal"
                          size="sm"
                          onClick={() => triggerModal(item)}
                          isDisabled={validateProductStatus(
                            productSale,
                            item.productCode
                          )}
                        >
                          {validateProductStatus(
                            productSale,
                            item.productCode
                          ) ? (
                            "Sold"
                          ) : (
                            "Sell"
                          )}
                        </Button>
                      </Flex>
                    </SimpleGrid>
                  </Flex>
                  <Divider />
                </div>
              ))
            )}
          </>
        </Stack>
      </Flex>
    </>
  );
};

ViewProducts.getLayout = (page) => (
  <ManufacturerLayout>{page} </ManufacturerLayout>
);

export default ViewProducts;
