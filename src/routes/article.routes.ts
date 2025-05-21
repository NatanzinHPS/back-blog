import { Router } from "express";
import { body } from "express-validator";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller";

const router = Router();

router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Título é obrigatório"),
    body("content").notEmpty().withMessage("Conteúdo é obrigatório"),
  ],
  validate,
  createArticle
);

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.put(
  "/:id",
  auth,
  [
    body("title").notEmpty().withMessage("Título é obrigatório"),
    body("content").notEmpty().withMessage("Conteúdo é obrigatório"),
  ],
  validate,
  updateArticle
);
router.delete("/:id", auth, deleteArticle);

export default router;
