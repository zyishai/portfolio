import nodemailer from 'nodemailer';
import { z } from 'zod';

const envSchema = z.object({
  TRANSPORT_HOST: z.string(),
  TRANSPORT_PORT: z.coerce.number(),
  TRANSPORT_USER: z.string(),
  TRANSPORT_PASS: z.string()
});
const env = envSchema.parse(process.env);

const transporter = nodemailer.createTransport({
  host: env.TRANSPORT_HOST,
  port: env.TRANSPORT_PORT,
  secure: true,
  auth: {
    user: env.TRANSPORT_USER,
    pass: env.TRANSPORT_PASS
  }
});

export async function sendEmail({ sender, email, message }: { sender: string; email: string; message: string }) {
  return await transporter.sendMail({
    from: 'Contact Me <contact@yishaizehavi.com>',
    to: 'zehaviyishai+contact@gmail.com',
    subject: `Message from ${sender} <${email}>`,
    text: message
  });
}
