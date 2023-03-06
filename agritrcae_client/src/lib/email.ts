import nodemailer from "nodemailer";
import { serviceAccount } from "../../env";
import fs from "fs";
import path from "path";
import { TEMPLATES_DIR } from "@/helpers/filesystemHelpers";
import { compile } from "handlebars";
import { WorkSpaceGmails } from "@/types/Email";

enum EmailTemplate {
  WELCOME = "welcome",
  SUPPLIER_INVITE = "supplier-invite",
}

interface IEmailHeader {
  to: string;
  from: string;
  subject: string;
  attachments?: any[];
}

export const createGmailTransport = async () => {
  // @ts-ignore
  const newServiceAcc = JSON.parse(serviceAccount);
  const transport = nodemailer.createTransport({
    service: "gmail",
    port: 80,
    secure: true,
    auth: {
      type: "OAUTH2",
      user: WorkSpaceGmails.MAIN,
      serviceClient: newServiceAcc.client_id,
      privateKey: newServiceAcc.private_key,
    },
  });

  try {
    await transport.verify();
    return transport;
  } catch (err) {
    console.log("Create GMAIL transport err", err);
    return null;
  }
};

const sendEmail = async (
  template: EmailTemplate,
  data: any,
  header: IEmailHeader,
  transport: nodemailer.Transporter
) => {
  const templateString = fs.readFileSync(
    path.join(TEMPLATES_DIR, `${template}.html`),
    "utf8"
  );

  const compiledTemplate = compile(templateString);

  // apply data to string
  const emittedHtml = compiledTemplate(data);

  const transportResp = await transport.sendMail({
    ...header,
    html: emittedHtml,
  });

  return transportResp;
};

export { sendEmail, EmailTemplate };
