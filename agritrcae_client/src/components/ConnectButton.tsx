import { env } from "@/config/enviroment";
import {
  getSubstrateChain,
  SubstrateChain,
  useBalance,
  useInkathon,
} from "@scio-labs/use-inkathon";
import { FC, useState } from "react";
import {
  Button,
  CheckboxIcon,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { truncateHash } from "@/utils/truncateHash";
import { encodeAddress } from "@polkadot/util-crypto";
import { toast } from "react-hot-toast";
import { AiOutlineCheckCircle, AiOutlineDisconnect } from "react-icons/ai";

export interface ConnectButtonProps {}

const ConnectButton: FC<ConnectButtonProps> = () => {
  const {
    activeChain,
    switchActiveChain,
    connect,
    disconnect,
    isConnecting,
    activeAccount,
    accounts,
    setActiveAccount,
  } = useInkathon();

  const { balanceFormatted } = useBalance(activeAccount?.address);

  const [supportedChains] = useState(
    env.supportedChains.map(
      (networkId) => getSubstrateChain(networkId) as SubstrateChain
    )
  );

  //   Connect BTN
  if (!activeAccount) {
    return (
      <Button
        onClick={connect}
        isLoading={isConnecting}
        colorScheme="teal"
        size={"md"}
        py={6}
        fontWeight={"bold"}
        rounded={"2xl"}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <>
      <Menu>
        <HStack>
          {balanceFormatted !== undefined && (
            <Button
              py={6}
              fontWeight={"bold"}
              rounded={"2xl"}
              pl={5}
              pointerEvents={"none"}
              fontSize={"sm"}
            >
              {balanceFormatted}
            </Button>
          )}
          <MenuButton
            as={Button}
            rightIcon={<FiChevronDown size={22} />}
            hidden={false}
            py={6}
            pl={5}
            rounded={"2xl"}
            fontWeight={"bold"}
          >
            <VStack spacing={0.5}>
              <Text fontSize={"sm"}>{activeAccount?.meta?.name}</Text>
              <Text fontSize={"xs"} fontWeight={"normal"} opacity={0.75}>
                {truncateHash(
                  encodeAddress(
                    activeAccount?.address,
                    activeChain?.ss58Prefix || 42
                  ),
                  8
                )}
              </Text>
            </VStack>
          </MenuButton>
        </HStack>
        <MenuList
          bgColor={"blackAlpha.900"}
          borderColor={"whiteAlpha.300"}
          rounded={"2xl"}
        >
          {supportedChains.map((chain) => (
            <MenuItem
              key={chain.network}
              isDisabled={chain.network === activeChain?.network}
              onClick={async () => {
                await switchActiveChain?.(chain);
                toast.success(`Switched to ${chain.name}`);
              }}
            >
              <CheckboxIcon />
              <VStack align={"start"} spacing={0}>
                <HStack>
                  <Text>{chain.name}</Text>
                  {chain.network === activeChain?.network && (
                    <AiOutlineCheckCircle size={16} />
                  )}
                </HStack>
              </VStack>
            </MenuItem>
          ))}
          {/* Available Accounts */}
          {(accounts || []).map((acc) => {
            const encodedAddress = encodeAddress(
              acc?.address,
              activeChain?.ss58Prefix || 42
            );
            const truncatedEncodedAddress = truncateHash(encodedAddress, 10);
            return (
              <MenuItem
                key={encodedAddress}
                isDisabled={acc.address === activeAccount.address}
                onClick={() => setActiveAccount?.(acc)}
              >
                <CheckboxIcon />
                <VStack align={"start"} spacing={0}>
                  <HStack>
                    <Text>{acc.meta?.name}</Text>
                    {acc.address === activeAccount.address && (
                      <AiOutlineCheckCircle size={16} />
                    )}
                  </HStack>
                  <Text fontSize={"xs"}>{truncatedEncodedAddress}</Text>
                </VStack>
              </MenuItem>
            );
          })}
          {/* Disconnect Btn */}
          <MenuDivider />
          <MenuItem
            onClick={disconnect}
            icon={<AiOutlineDisconnect size={18} />}
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default ConnectButton;
