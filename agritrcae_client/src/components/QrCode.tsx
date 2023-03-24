import { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import { QRCode } from "react-qrcode-logo";

interface QrCodeProps {
  isOpen: boolean;
  onClose: () => void;
  serial_no: string | number;
}

const QrCode = ({ isOpen, onClose, serial_no }: QrCodeProps) => {
  const [url, setUrl] = useState<string>("");
  const qrRef = useRef(null);

  const downloadQR = () => {
    html2canvas(document.querySelector("#react-qrcode-logo") as any, {
      useCORS: true,
    }).then(function (canvas) {
      const link = document.createElement("a");
      link.download = `QRCode-${serial_no}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  useEffect(() => {
    if (serial_no) {
      setUrl(
        `https://agritrace.vercel.app/trace/${serial_no}`
      );
    }
  }, [serial_no]);


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Product Qr Code of serial no</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex ref={qrRef} justify={"center"} align={"center"}>
            <QRCode value={url} size={300} qrStyle={"dots"} />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme={"teal"} onClick={downloadQR}>
            Download Qr Code
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QrCode;
