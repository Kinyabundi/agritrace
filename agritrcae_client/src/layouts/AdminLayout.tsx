import React, { ReactNode, useEffect, useState } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { RiArrowDownSLine, RiSwapFill } from "react-icons/ri";
import { GiMilkCarton, GiSwapBag } from "react-icons/gi";
import { BsCreditCard } from "react-icons/bs";
import { FaPeopleCarry } from "react-icons/fa";
import { MdAccountBalanceWallet, MdPeople } from "react-icons/md";
import { IconType } from "react-icons";
import ConnectButton from "@/components/ConnectButton";
import useManufacturer from "@/hooks/useManufacturer";
import { AiOutlineMessage } from "react-icons/ai";
import { IManufacturer } from "@/types/Manufacturer";
import TextLink from "@/components/TextLink";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  {
    name: "Dashboard",
    icon: RiSwapFill,
    href: `/admin/dashboard`,
  },
  {
    name: "Manufacturers",
    icon: FaPeopleCarry,
    href: "/admin/view-manufacturers",
  },
  {
    name: "Suppliers",
    icon: MdPeople,
    href: "/admin/view-suppliers",
  },
  { name: "Products", icon: GiMilkCarton, href: "/admin/products" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getManufacturerAcccount } = useManufacturer();
  const [manufacturer, setManufacturer] = useState<IManufacturer>();

  const fetchManufacturer = async () => {
    const item = await getManufacturerAcccount();
    if (item) {
      // @ts-ignore
      setManufacturer(Object.values(item)[0]);
    }
  };

  useEffect(() => {
    // abort controller
    const abortController = new AbortController();
    fetchManufacturer();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} manufacturerName={manufacturer} />

      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          AgriTrace
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link?.href}>
          {link.name}
        </NavItem>
      ))}
      <Box mx={"4"}>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<RiArrowDownSLine />}
            p={4}
            w={"full"}
            bg={"transparent"}
            _hover={{
              bg: "cyan.400",
              color: "white",
            }}
            leftIcon={<GiSwapBag />}
          >
            Raw Materials
          </MenuButton>
          <MenuList>
            <TextLink href={"/admin/raw-materials"}>
              <MenuItem>Added</MenuItem>
            </TextLink>
            <MenuItem>In Transaction</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  href: string;
  children: ReactNode;
}
const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  return (
    //@ts-ignore
    <Link
      href={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  manufacturerName: any;
}
const MobileNav = ({ onOpen, manufacturerName, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        AT
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <ConnectButton />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{manufacturerName?.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
