import { IRawMaterial } from "@/types/Contracts";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Toast,
  useToast,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { ContractID } from "@/types/Contracts";
import { useState, useEffect } from "react";
import CustomFormControl from "./CustomFormControl";
import useManufacturer from "@/hooks/useManufacturer";
import { IManufacturer } from "@/types/Manufacturer";
import {
  contractQuery,
  contractTx,
  unwrapResultOrError,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { IToastProps } from "@/types/Toast";
import { concatManufacturers, generateNumbers } from "@/utils/utils";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  rawMaterialDetails?: IRawMaterial;
}

export default function SaleModal({
  open,
  setOpen,
  rawMaterialDetails,
}: ModalProps) {
  const [batchNo, setBatchNo] = useState<number>();
  const toast = useToast();
  const { activeSigner, api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Transactions);
  const [manufacturers, setManufacturers] = useState<IManufacturer[]>();
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");
  const { getManufacturers } = useManufacturer();
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
  useEffect(() => {
    fetchManufacturers();
  }, [activeAccount]);

  const fetchManufacturers = async () => {
    const manufacturers = await getManufacturers();
    if (manufacturers) {
      setManufacturers(manufacturers);
    }
  };
  const clickInitiateSale = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      return customToast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
        status: "error",
      });
    }
    try {
      api.setSigner(activeSigner);

      await contractTx(
        api,
        activeAccount.address,
        contract,
        "initiateSale",
        undefined,
        [
          rawMaterialDetails.entityCode,
          rawMaterialDetails.quantity,
          rawMaterialDetails.quantityUnits,
          batchNo,
          selectedBuyer,
        ],
        (sth) => {
          if (sth?.status.isInBlock) {
            customToast({
              title: "Sale intialized",
              description: "Sale intialized successfully",
              status: "success",
            });
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
    }
  };

  console.log(selectedBuyer);
  return (
    // @ts-ignore
    <Modal closeOnOverlayClick={false} isOpen={open} onClose={setOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sell Entity</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Batch No</FormLabel>
            <InputGroup>
              <Input
                placeholder="627782"
                value={batchNo}
                borderRadius={25}
                borderColor={"gray.300"}
                borderWidth={1}
                _focus={{
                  borderColor: "gray.100",
                  borderWidth: 1,
                }}
                fontWeight="500"
                size="md"
                focusBorderColor="navyblue"
              />
              <InputRightElement>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setBatchNo(generateNumbers())}
                >
                  Generate
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <CustomFormControl
            labelText="Select Buyer"
            variant="select"
            options={manufacturers ? concatManufacturers(manufacturers) : []}
            onChange={(e) => setSelectedBuyer(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Initiate Sell
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
