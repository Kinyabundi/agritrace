import type { NextApiRequest, NextApiResponse } from 'next';
import {sendSMS} from "@/lib/sendSMS";

export default function smsServer(req: NextApiRequest, res: NextApiResponse): void {
  if (req.method === 'POST') {
    const { message } = req.body;

    sendSMS(message);

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}