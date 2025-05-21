import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { query } from "./utils/db";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do Blog rodando! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get("/testeBanco", async (req, res) => {
  try {
    const users = await query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro na conexão com o banco", error });
  }
});

app.use("/api/auth", authRoutes);