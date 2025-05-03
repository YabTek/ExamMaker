import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import * as userRoutes from "./routes/index"
import { authRouter } from "./routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", userRoutes.authRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB;
  console.log(`Server running on port ${PORT}`);
});
