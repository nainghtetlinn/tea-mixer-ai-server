import cors from "cors";
import express from "express";
import morgan from "morgan";
import config from "./config/config";
import { errorHandler } from "./middlewares/errorHandler";
import chatRouter from "./routes/chat";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/chat", chatRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});
