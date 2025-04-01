import { Request, Response } from "express";
import { Todo } from "../models/Todo";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const createTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { todoItem } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: "Bad Request: User ID is missing!" });
      return;
    }

    const newTodo = new Todo({
      user: userId,
      todoItem,
    });
    await newTodo.save();
    res
      .status(201)
      .json({ message: "New ToDo saved successfully!", todo: newTodo });
  } catch (err) {
    console.error(`Error creating todo: ${err}`);
    res
      .status(500)
      .json({ message: "Failed to create ToDo, please try again." });
  }
};

export const getTodos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: "Bad Request: User ID is missing!" });
      return;
    }

    const todos = await Todo.find({ user: userId });
    res.status(200).json({ message: "Todos fetched successfully", todos });
  } catch (err) {
    console.error(`Error fetching todos: ${err}`);
    res
      .status(500)
      .json({ message: "Failed to fetch ToDos, please try again." });
  }
};

export const updateTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const todoId = req.params.id;
    const { status } = req.body;

    if (!userId) {
      res.status(400).json({ message: "Bad Request: User ID is missing!" });
      return;
    }

    if (status !== "pending" && status !== "completed") {
      res.status(400).json({
        message: "Invalid status, use either 'pending' or 'completed'.",
      });
      return;
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { user: userId, _id: todoId },
      { status },
      { new: true }
    );

    if (!updatedTodo) {
      res.status(404).json({ message: "Todo not found or no update made!" });
      return;
    }

    res.status(200).json({ message: "Todo updated successfully", updatedTodo });
  } catch (err) {
    console.error(`Error updating todo: ${err}`);
    res
      .status(500)
      .json({ message: "Failed to update ToDo, please try again." });
  }
};

export const deleteTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const todoId = req.params.id;

    if (!userId) {
      res.status(400).json({ message: "Bad Request: User ID is missing!" });
      return;
    }

    const deletedTodo = await Todo.findOneAndDelete({
      user: userId,
      _id: todoId,
    });

    if (!deletedTodo) {
      res.status(404).json({ message: "Todo not found or already deleted!" });
      return;
    }

    res
      .status(200)
      .json({ message: "Todo has been deleted successfully!", deletedTodo });
  } catch (err) {
    console.error(`Error deleting todo: ${err}`);
    res
      .status(500)
      .json({ message: "Failed to delete ToDo, please try again." });
  }
};
