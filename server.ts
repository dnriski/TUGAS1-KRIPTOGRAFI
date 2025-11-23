import express from "express";
import type { Request, Response } from "express";
import userRouter from "./src/script"

const app = express();

app.use(express.json());

app.use("/", userRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("Project dengan Express + Prisma berjalan!");
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
