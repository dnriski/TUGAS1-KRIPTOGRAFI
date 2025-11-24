import express from "express";
import userRouter from "./src/script"

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.static("src/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.json());

app.use("/", userRouter)

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
