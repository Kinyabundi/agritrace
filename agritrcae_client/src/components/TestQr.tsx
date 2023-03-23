import html2canvas from "html2canvas";
import React, { useState } from "react";

const TestQr = () => {
  const [state, setState] = useState<{ [key: string]: any }>({});

  const handleChange = ({ target }: any) => {
    setState({ ...state, [target.name]: target.value });
  };

  const handleDownload = () => {
    html2canvas(document.querySelector("#react-qrcode-logo") as any).then(
      function (canvas) {
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    );
  };

  

  return <div>TestQr</div>;
};

export default TestQr;
