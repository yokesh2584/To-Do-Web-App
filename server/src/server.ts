import express, { json, Request, Response, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoute";
import MongoDb from "./config/db";

dotenv.config();
MongoDb();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://mytodos-site-webapp.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.end("MERN To-Do API is running!");
});

app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

export default app;

app.listen(port, () =>
  console.log(`Server running on "http://localhost:${port}"`)
);
