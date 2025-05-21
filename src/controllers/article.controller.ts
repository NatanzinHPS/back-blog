import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { query } from "../utils/db";

export const createArticle = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const image = req.file?.filename;

  try {
    await query(
      "INSERT INTO articles (title, content, user_id, image) VALUES (?, ?, ?, ?)",
      [title, content, userId, image]
    );
    res.status(201).json({ message: "Artigo criado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar artigo", error });
  }
};

export const getArticles = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT a.id, a.title, a.content, a.image, a.created_at, a.updated_at, u.name AS author 
       FROM articles a 
       JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC`
    );

    const articles = result as any[];

    const formatted = articles.map((article) => ({
      ...article,
      image: article.image
        ? `${req.protocol}://${req.get("host")}/uploads/${article.image}`
        : null,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar artigos", error });
  }
};



export const getArticleById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT a.id, a.title, a.content, a.image, a.created_at, a.updated_at, u.name AS author 
       FROM articles a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.id = ?`,
      [id]
    );

    const articles = result as any[];
    const article = articles[0];

    if (!article) {
      return res.status(404).json({ message: "Artigo não encontrado" });
    }

    article.image = article.image
      ? `${req.protocol}://${req.get("host")}/uploads/${article.image}`
      : null;

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar artigo", error });
  }
};



export const updateArticle = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;
  const image = req.file?.filename;

  try {
    const article: any = await query("SELECT * FROM articles WHERE id = ?", [id]);
    if (article.length === 0) return res.status(404).json({ message: "Artigo não encontrado" });
    if (article[0].user_id !== userId)
      return res.status(403).json({ message: "Não autorizado a editar este artigo" });

    const updateQuery = image
      ? "UPDATE articles SET title = ?, content = ?, image = ? WHERE id = ?"
      : "UPDATE articles SET title = ?, content = ? WHERE id = ?";

    const updateParams = image ? [title, content, image, id] : [title, content, id];

    await query(updateQuery, updateParams);
    res.json({ message: "Artigo atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar artigo", error });
  }
};


export const deleteArticle = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const article: any = await query("SELECT * FROM articles WHERE id = ?", [id]);
    if (article.length === 0) return res.status(404).json({ message: "Artigo não encontrado" });
    if (article[0].user_id !== userId)
      return res.status(403).json({ message: "Não autorizado a excluir este artigo" });

    await query("DELETE FROM articles WHERE id = ?", [id]);
    res.json({ message: "Artigo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir artigo", error });
  }
};
