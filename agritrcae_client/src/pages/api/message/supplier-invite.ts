import { IInviteMessageBody } from "@/types/Supplier";
import { Client } from "africastalking-ts";
import type { NextApiRequest, NextApiResponse } from "next";
import { africastalking_api_key } from "../../../../env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return invite(req, res);
  }
}

async function invite(req: NextApiRequest, res: NextApiResponse) {
  const reqBody = req.body as IInviteMessageBody;

  const client = new Client({
    // @ts-ignore
    apiKey: africastalking_api_key,
    username: "agritrace",
  });

  client
    .sendSms({
      to: reqBody.phoneno,
      message: reqBody.inviteCode || "Something sleek",
    })
    .then((value) => {
      console.log(value);
      res.status(200).json({
        status: "ok",
        msg: "Invite Sent successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "error",
        msg: "Something went wrong",
      });
    });
}
