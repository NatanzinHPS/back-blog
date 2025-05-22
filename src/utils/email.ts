import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3a9a8dc12bfc3c",
    pass: "542795442b8ab6",
  },
});

export const sendResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: "Recuperação de Senha",
    html: `
      <p>Você solicitou a recuperação de senha.</p>
      <p>Clique no link abaixo para redefinir sua senha. Ele expira em 1 hora:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};
