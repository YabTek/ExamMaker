import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import * as userRoutes from "./routes/index"
import * as quizRoutes from "./routes/index"
import { AppError } from "./core/errors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => { 
  socket.on("player_joined", (updatedPlayers) => {
    socket.broadcast.emit("player_joined", updatedPlayers);
  });
  socket.on("start_quiz", () =>{
    io.emit("quiz_started");
  });
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
})

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", userRoutes.authRouter)
app.use('/api', quizRoutes.quizRouter);

const PORT = process.env.PORT || 5000;


app.use((err, req, res, next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: "Something went wrong" });
    }
});


server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
