import { Box, Icon, useColorModeValue, chakra, Image } from "@chakra-ui/react";
import { NextPageWithLayout } from "@/types/Layout";
import HomeLayout from "@/layouts/HomeLayout";
import useAuth from "@/hooks/store/useAuth";
import { Role } from "@/types/Manufacturer";
import { useMemo } from "react";
import useDidHydrate from "@/hooks/useDidHydrate";

const Home: NextPageWithLayout = () => {
  const bg = useColorModeValue("white", "gray.800");
  const { didHydrate } = useDidHydrate();

  const userData = useAuth((state) => state.user);

  const user = useMemo(() => {
    if (didHydrate) {
      return userData;
    }

    return null;
  }, [didHydrate, userData]);

  return (
    <Box pos="relative" overflow="hidden" bg={bg} mt={10}>
      <Box maxW="7xl" mx="auto">
        <Box
          pos="relative"
          pb={{
            base: 8,
            sm: 16,
            md: 20,
            lg: 28,
            xl: 32,
          }}
          maxW={{
            lg: "2xl",
          }}
          w={{
            lg: "full",
          }}
          zIndex={1}
          bg={bg}
          border="solid 1px transparent"
        >
          <Icon
            display={{
              base: "none",
              lg: "block",
            }}
            position="absolute"
            right={0}
            top={0}
            bottom={0}
            h="full"
            w={48}
            color={bg}
            transform="translateX(50%)"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </Icon>
          <Box
            mx="auto"
            maxW={{
              base: "7xl",
            }}
            px={{
              base: 4,
              sm: 6,
              lg: 8,
            }}
            mt={{
              base: 10,
              sm: 12,
              md: 16,
              lg: 20,
              xl: 28,
            }}
          >
            <Box
              w="full"
              textAlign={{
                sm: "center",
                lg: "left",
              }}
              justifyContent="center"
              alignItems="center"
            >
              <chakra.h1
                fontSize={{
                  base: "4xl",
                  sm: "5xl",
                  md: "6xl",
                }}
                letterSpacing="tight"
                lineHeight="short"
                fontWeight="extrabold"
                color="gray.900"
                _dark={{
                  color: "white",
                }}
              >
                <chakra.span
                  display={{
                    base: "block",
                    xl: "inline",
                  }}
                >
                  BlockChain Solution for{" "}
                </chakra.span>
                <chakra.span
                  display={{
                    base: "block",
                    xl: "inline",
                  }}
                  color="brand.600"
                  _dark={{
                    color: "brand.400",
                  }}
                >
                  Dairy Industry
                </chakra.span>
              </chakra.h1>
              <chakra.p
                mt={{
                  base: 3,
                  sm: 5,
                  md: 5,
                }}
                fontSize={{
                  sm: "lg",
                  md: "xl",
                }}
                maxW={{
                  sm: "xl",
                }}
                mx={{
                  sm: "auto",
                  lg: 0,
                }}
                color="gray.500"
              >
                Agritrace is a blockchain solution for dairy industry. It is a
                decentralized platform that allows farmers to trace their
                products from the farm to the consumer. It also allows consumers
                to verify the authenticity of the product.
              </chakra.p>
              <Box
                mt={{
                  base: 5,
                  sm: 8,
                }}
                display={{
                  sm: "flex",
                }}
                justifyContent={{
                  sm: "center",
                  lg: "start",
                }}
                fontWeight="extrabold"
                fontFamily="fantasy"
              >
                <Box rounded="full" shadow="md">
                  <chakra.a
                    w="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="solid 1px transparent"
                    fontSize={{
                      base: "md",
                      md: "lg",
                    }}
                    rounded="md"
                    color="white"
                    bg="black"
                    _hover={{
                      bg: "brand.700",
                    }}
                    px={{
                      base: 8,
                      md: 10,
                    }}
                    py={{
                      base: 3,
                      md: 4,
                    }}
                    cursor="pointer"
                    href={
                      user
                        ? user?.role === Role.MANUFACTURER
                          ? "/manufacturer/dashboard"
                          : user?.role === Role.SUPPLIER
                          ? "/supplier/dashboard"
                          : user?.role === Role.DISTRIBUTOR
                          ? "/distributor/dashboard"
                          : "/onboarding/manufacturer"
                        : "/onboarding/manufacturer"
                    }
                  >
                    {user
                      ? user?.role === Role.MANUFACTURER
                        ? "Go to Dashboard"
                        : user?.role === Role.SUPPLIER
                        ? "Go to Dashboard"
                        : user?.role === Role.DISTRIBUTOR
                        ? "Go to Dashboard"
                        : "Get Started"
                      : "Get Started"}
                  </chakra.a>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        position={{
          lg: "absolute",
        }}
        top={{
          lg: 0,
        }}
        bottom={{
          lg: 0,
        }}
        right={{
          lg: 0,
        }}
        w={{
          lg: "50%",
        }}
        border="solid 1px transparent"
      >
        <Image
          h={[56, 72, 96, "full"]}
          w="full"
          fit="cover"
          src="https://images.ctfassets.net/ww1ie0z745y7/3IBKzJr4JViUIhUKEyXTlG/4f2b030eaf1cc9e25a449181459b7365/Screen_Shot_2021-11-11_at_3.44.15_PM-min.png?q=75"
          alt=""
          loading="lazy"
        />
      </Box>
    </Box>
  );
};

Home.getLayout = (page) => <HomeLayout>{page}</HomeLayout>;

export default Home;
