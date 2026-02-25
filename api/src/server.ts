import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import * as userRoutes from "./routes/index"
import * as quizRoutes from "./routes/index"
import { AppError } from "./core/errors";
import http from "http";
import { Server } from "socket.io";
import { QuizModel } from "./models/quizModel";

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

const QUIZ_DURATION_SECONDS = 50;

io.on("connection", (socket) => {
  socket.on("join_room", (quizId: string) => {
    socket.join(quizId);
  });

  socket.on("sync_players", async (quizId: string) => {
    try {
      const quiz = await QuizModel.findById(quizId).lean();
      if (!quiz) return;
      const players = quiz.players.filter((p: { hasJoined?: boolean }) => p.hasJoined);
      io.to(quizId).emit("player_joined", players);
    } catch {
    }
  });

  socket.on("start_quiz", async (quizId: string) => {
    try {
      await QuizModel.findByIdAndUpdate(quizId, {
        startedAt: new Date(),
        duration: QUIZ_DURATION_SECONDS,
      });
      io.to(quizId).emit("quiz_started");
    } catch {
      // ignore
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

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
