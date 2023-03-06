import { Client } from 'africastalking-ts';

const apiKey = '';
const username = '';

export async function sendSMS(message:string): Promise<void> {
  try {
    const client = new Client({ apiKey, username });
    const result = await client.sendSms({
      to: '[Your_phone_number_goes_here]', 
      message: 'Hey AT Ninja! Wassup...',
    });
    console.log(result);
  } catch (ex) {
    console.error(ex);
  }
}