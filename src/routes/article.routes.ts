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
import upload from "../middlewares/upload";

const router = Router();

router.post(
  "/",
  auth,
  upload.single("image"),
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
  upload.single("image"),
  [
    body("title").notEmpty().withMessage("Título é obrigatório"),
    body("content").notEmpty().withMessage("Conteúdo é obrigatório"),
  ],
  validate,
  updateArticle
);
router.delete("/:id", auth, deleteArticle);

export default router;
