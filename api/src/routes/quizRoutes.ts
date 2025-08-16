import { Router } from "express";
import { createQuiz } from "../controllers/quizControllers";

const quizRouter = Router();

quizRouter.post("/createQuiz", createQuiz);

export default quizRouter;
