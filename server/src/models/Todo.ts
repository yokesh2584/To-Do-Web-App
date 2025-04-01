import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITodo extends Document {
  user: Types.ObjectId;
  todoItem: string;
  status: "pending" | "completed";
}

const TodoSchema = new Schema<ITodo>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    todoItem: { type: String, required: true },
    status: { type: String, enum: ["pending", "complete"], default: "pending" },
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model<ITodo>("Todo", TodoSchema);