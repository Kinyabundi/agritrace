import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";

interface QrCodeProps {
  isOpen: boolean;
  onClose: () => void;
  serial_no: string | number;
}

const QrCode = ({ isOpen, onClose, serial_no }: QrCodeProps) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (serial_no) {
      setUrl(
        `https://agritrace-git-dev-vingitonga.vercel.app/trace/${serial_no}`
      );
    }
  }, [serial_no]);

  const qrCode = (
    <QRCodeCanvas
      value={url}
      size={256}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"L"}
      includeMargin={true}
      imageSettings={{
        src: "https://media.istockphoto.com/id/1028104580/vector/realistic-3d-milk-carton-packing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=TkAEtVfkxcyex7vDmpel2YU6UdFDOumxiXXOiIALd6o=",
        x: null,
        y: null,
        height: 30,
        width: 30,
        excavate: true,
      }}
    />
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Product Qr Code of serial no</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>{qrCode}</Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme={"teal"}>Print Qr Code</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QrCode;
