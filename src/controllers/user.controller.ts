import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { query } from "../utils/db";
import bcrypt from "bcrypt";

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const result: any = await query(
      "SELECT id, name, email, image FROM users WHERE id = ?",
      [userId]
    );
    const user = result[0];

    if (user.image)
      user.image = `${req.protocol}://${req.get("host")}/uploads/${user.image}`;

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar perfil", error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { name, email } = req.body;
  const image = req.file?.filename;

  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (image) {
      fields.push("image = ?");
      values.push(image);
    }

    if (fields.length > 0) {
      const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
      values.push(userId);
      await query(sql, values);
    }

    res.json({ message: "Perfil atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil", error });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const result: any = await query("SELECT password FROM users WHERE id = ?", [
      userId,
    ]);
    const user = result[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Senha atual incorreta" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    res.json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao alterar senha", error });
  }
};
