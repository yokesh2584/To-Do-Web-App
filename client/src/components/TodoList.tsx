import { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

interface Todo {
  _id: string;
  user: string;
  todoItem: string;
  status: "pending" | "completed";
}

const TodoList = () => {
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const getTodos = async () => {
    try {
      const response = await axios.get<{ todos: Todo[] }>(
        "https://todo-web-server.vercel.app/todos/get-todo",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      setTodos(response.data.todos);
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching Todos");
    }
  };
  useEffect(() => {
    const username = localStorage.getItem("username") ?? "";
    setUsername(username);
    getTodos();

    const timer = setTimeout(() => setShowPopup(false), 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddTodo = async () => {
    try {
      const response = await axios.post<{ todo: Todo }>(
        "https://todo-web-server.vercel.app/todos/create-todo",
        { todoItem: todo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      setTodos((prevTodos) => [...prevTodos, response.data.todo]);
      setTodo("");
    } catch (err) {
      console.error("Error adding todo", err);
    }
  };

  const handleUpdate = async (id: string, status: "pending" | "completed") => {
    try {
      const updatedStatus = status === "pending" ? "completed" : "pending";
      await axios.put<{ todo: Todo }>(
        `https://todo-web-server.vercel.app/todos/update-todo/${id}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      setTodos((prevTodo) =>
        prevTodo.map((t) =>
          t._id === id ? { ...t, status: updatedStatus } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete<{ todo: Todo }>(
        `https://todo-web-server.vercel.app/todos/delete-todo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      getTodos();
    } catch (err) {
      console.error(`Error deleting todo: ${err}`);
    }
  };

  return (
    <div className="todo-container">
      {showPopup && (
        <div className="popup-welcome">
          👋 Welcome, <span className="username">{username}</span>!
        </div>
      )}
      <h1 className="todo-title">Pin Task</h1>
      <div className="todo-input-container">
        <input
          className="todo-input"
          type="text"
          placeholder="Enter your task..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          className="todo-add-btn"
          type="button"
          onClick={handleAddTodo}
          disabled={!todo.trim()}
        >
          Add
        </button>
      </div>
      <ul className="todo-list">
        {todos.map((t) => (
          <li key={t._id} className={`todo-item ${t.status}`}>
            <span
              className="todo-text"
              onClick={() => handleUpdate(t._id, t.status)}
            >
              {t.todoItem}
            </span>
            <button
              title="delete-btn"
              className="todo-delete-btn"
              type="button"
              onClick={() => handleDelete(t._id)}
            >
              {/* <i className="bi bi-trash3-fill"></i> */}❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
