import express from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-todo", authMiddleware, createTodo);
router.get("/get-todo", authMiddleware, getTodos);
router.put("/update-todo/:id", authMiddleware, updateTodo);
router.delete("/delete-todo/:id", authMiddleware, deleteTodo);

export default router;
