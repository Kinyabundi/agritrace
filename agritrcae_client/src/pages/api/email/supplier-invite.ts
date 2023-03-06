// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createGmailTransport, EmailTemplate, sendEmail } from "@/lib/email";
import { WorkSpaceGmails } from "@/types/Email";
import { IInviteBody } from "@/types/Supplier";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: "ok" | "error";
  msg: string;
  data?: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      res.status(200).json({
        status: "ok",
        msg: "GET request not supported",
      });
    case "POST":
      return triggerSupplierInvite(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function triggerSupplierInvite(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqBody = req.body as IInviteBody;

  if (!reqBody.email) {
    res.status(400).json({
      status: "error",
      msg: "Email of the recipient is missing",
    });
    return;
  }

  try {
    const transport = await createGmailTransport();
    if (transport) {
      const resp = await sendEmail(
        EmailTemplate.SUPPLIER_INVITE,
        reqBody,
        {
          to: reqBody.email,
          from: `AgriTrace | Supplier Invite Join <${WorkSpaceGmails.MAIN}>`,
          subject: `${reqBody.company} Invites to Join Their Supply Chain`,
        },
        transport
      );
      console.log(resp);
      res.status(200).json({
        status: "ok",
        msg: "Email sent successfully",
      });
    } else {
      res.status(500).json({
        status: "error",
        msg: "Could not send email",
      });
    }
  } catch (err) {
    console.log("Error sending email", err);
    res.status(500).json({
      status: "error",
      msg: "Could not send email",
    });
  }
}
