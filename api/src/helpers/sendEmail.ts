import nodemailer from "nodemailer";
import { generateResetToken } from "./generateResetToken";

export const sendEmail = async (user: object, email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetToken = await generateResetToken(user);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `Click here to reset your password: ${resetLink}`,
  });

  return resetToken; 
};

