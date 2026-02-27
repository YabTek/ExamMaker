import { Router } from "express";
import { createQuiz, joinQuiz, fetchQuiz, updateScore, getTimeLeft, startQuiz, submitQuizAttempt, getUserHistory, getUserAnalytics, getQuizAttemptDetail } from "../controllers/quizControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const quizRouter = Router();

quizRouter.post("/createQuiz", authMiddleware, createQuiz);
quizRouter.post("/joinQuiz/:id", authMiddleware, joinQuiz);
quizRouter.get("/fetchQuiz/:id", fetchQuiz);
quizRouter.post("/startQuiz/:id", startQuiz);
quizRouter.get("/timeLeft/:id", getTimeLeft);
quizRouter.post("/updateScore/:id", authMiddleware, updateScore);
quizRouter.post("/submit-attempt", authMiddleware, submitQuizAttempt);
quizRouter.get("/history", authMiddleware, getUserHistory);
quizRouter.get("/analytics", authMiddleware, getUserAnalytics);
quizRouter.get("/attempt/:attemptId", authMiddleware, getQuizAttemptDetail);

export default quizRouter;
