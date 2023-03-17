import { IProduct, IProductSold } from "@/types/Contracts";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ContractID } from "@/types/Contracts";
import { useState, useEffect } from "react";
import CustomFormControl from "./CustomFormControl";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { IToastProps } from "@/types/Toast";
import { concatDistributors, generateNumbers } from "@/utils/utils";
import useDistributor from "@/hooks/useDistributor";
import { IDistributor } from "@/types/Distributor";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productsDetails?: IProductSold | IProduct;
}

export default function SaleModal({
  open,
  setOpen,
  productsDetails,
}: ModalProps) {
  const toast = useToast();
  const { activeSigner, api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Transactions);
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");
  const [distributor, setDistributor] = useState<IDistributor[]>([]);
  const { getDistributors } = useDistributor();
  const [loading, setLoading] = useState<boolean>(false);
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
    fetchDistributor();
  }, [activeAccount]);

  const fetchDistributor = async () => {
    const distributors = await getDistributors();
    if (distributors) {
      setDistributor(distributors);
    }
  };

  const InitiateSale = async () => {
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
        [
          productsDetails.productCode,
          productsDetails.quantity,
          productsDetails.quantityUnits,
          productsDetails.rawMaterials,
          selectedBuyer,
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
  };

  console.log(productsDetails);
  return (
    // @ts-ignore
    <Modal closeOnOverlayClick={false} isOpen={open} onClose={setOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sell Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <CustomFormControl
            labelText="Select Buyer"
            variant="select"
            options={distributor ? concatDistributors(distributor) : []}
            onChange={(e) => setSelectedBuyer(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => InitiateSale()}
            isLoading={loading}
            loadingText="Initiating sale"
          >
            Initiate Sell
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
