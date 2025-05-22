import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../utils/db";
import crypto from "crypto";
import { sendResetEmail } from "../utils/email";

const JWT_SECRET = process.env.JWT_SECRET || "secreto";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser: any = await query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro no registro", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const users: any = await query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user)
      return res.status(400).json({ message: "Email ou senha inválidos" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Email ou senha inválidos" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no login", error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result: any = await query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length === 0)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    await query(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
      [token, expires, email]
    );

    await sendResetEmail(email, token);

    res.json({ message: "Email de recuperação enviado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar email", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const result: any = await query(
      "SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (result.length === 0)
      return res.status(400).json({ message: "Token inválido ou expirado" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashed, result[0].id]
    );

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao redefinir senha", error });
  }
};
