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
} from "@chakra-ui/react";
import { ContractID } from "@/types/Contracts"
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
  const toast = useToast();
  const { activeSigner, api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Transactions);
  const [manufacturers, setManufacturers] = useState<IManufacturer>();
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
  const clickInitiateSale = async (
    entityCode: string,
    quantity: number,
    quantityUnits: string,
    batchNo: string,
    buyer: string
  ) => {
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
        [entityCode, quantity, quantityUnits, batchNo, buyer],
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
  return (
    <Modal closeOnOverlayClick={false} isOpen={open} onClose={setOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sell Entity</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <CustomFormControl labelText="Batch No" placeholder="627782" />
          <CustomFormControl
            labelText="Select Buyer"
            variant="select"
            options={["Manu1 - yw7278181", "Manu2 - y253627"]}
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
