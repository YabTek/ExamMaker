import fs from "fs/promises";
import path from "path";
import { BadRequestError, NotFoundError } from "../core/errors";
import { CreatedResponse, SuccessResponse } from "../core/successResponse";
import quizRepo from "../repositories/quizRepository";
import { Request } from "express";
import { errorResponse } from "../core/errorResponse";
import { JwtPayload } from "jsonwebtoken";
import { QuizModel } from "../models/quizModel";
import { Types } from "mongoose";

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

function getRandomQuestions<T>(questions: T[], count: number): T[] {
  const randomQuestions = [...questions].sort(() => Math.random() - 0.5);
  return randomQuestions.slice(0, count);
}

async function loadQuestions(language: string, count: number) {
  const filePath = path.resolve(__dirname, "../data", `${language}.json`);
  const content = await fs.readFile(filePath, "utf-8");
  const questions = JSON.parse(content);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new BadRequestError("Question bank is empty or invalid");
  }

  return getRandomQuestions(questions, count);
}

export const createQuiz = async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    console.log(user)
    const { language, mode } = req.body;
    if (!language || !mode) {
      throw new BadRequestError("Language and mode are required");
    }

    const questions = await loadQuestions(language.toLowerCase(), 15);
    const quiz = await quizRepo.createQuiz(mode.toLowerCase(), questions, { _id: user.userId, username: user.username, isHost: true });

    new CreatedResponse("Quiz created successfully", {quizId: quiz._id,questions: quiz.questions}).send(res);
  } catch (error) {
    errorResponse(error, res);
  }
};

export const joinQuiz = async (req: AuthRequest, res) => {
  try{
    const user = req.user;
    const { id } = req.params;

    let quiz = await quizRepo.getQuizById(id);
    if (!quiz) throw new NotFoundError("Quiz not found");
    let updatedQuiz = quiz;

    const exists = quiz.players.find(p => p.username === user.username);
    if (!exists) {
      updatedQuiz = await quizRepo.addPlayer(id, { _id: user.userId, username: user.username, hasJoined: true });
      if (!updatedQuiz) updatedQuiz = await quizRepo.getQuizById(id);
    } else if (exists.isHost && !exists.hasJoined) {
      updatedQuiz = await quizRepo.updateStatus(id, user.userId);
    }
   
    new CreatedResponse("Player joined", {players: updatedQuiz.players, currentUser: { id: user.userId, username: user.username }}).send(res);
  } catch (error) {
    errorResponse(error, res);
  }
};

export const fetchQuiz = async (req: Request, res) => {
  try{
    const { id } = req.params;
    let quiz = await quizRepo.getQuizById(id);
    if (!quiz) throw new NotFoundError("Quiz not found");
    new CreatedResponse("Quiz retrieved", quiz).send(res);
  } catch (error) {
    errorResponse(error, res);
  }
}

export const startQuiz = async (req: Request, res) => {
  try {
    const { id } = req.params;
    const quiz = await quizRepo.getQuizById(id);
    if (!quiz) throw new NotFoundError("Quiz not found");

    const startedAt = (quiz as any).startedAt;
    if (startedAt) {
      new SuccessResponse("Quiz already started", { startedAt }).send(res);
      return;
    }

    const now = new Date();
    await QuizModel.findByIdAndUpdate(id, { startedAt: now, duration: 50 });
    new SuccessResponse("Quiz started", { startedAt: now }).send(res);
  } catch (error) {
    errorResponse(error, res);
  }
};

export const getTimeLeft = async (req: Request, res) => {
  try {
    const { id } = req.params;
    const quiz = await quizRepo.getQuizById(id);
    if (!quiz) throw new NotFoundError("Quiz not found");

    const startedAt = (quiz as any).startedAt;
    const duration = (quiz as any).duration ?? 50;

    if (!startedAt) {
      new SuccessResponse("Quiz not started", { timeLeft: duration, started: false }).send(res);
      return;
    }

    const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
    const timeLeft = Math.max(0, Math.floor(duration - elapsed));

    new SuccessResponse("Time retrieved", { timeLeft, startedAt, duration, started: true }).send(res);
  } catch (error) {
    errorResponse(error, res);
  }
};

export const updateScore = async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { score } = req.body;

    const quiz = await QuizModel.findById(id);
    if (!quiz) throw new NotFoundError("Quiz not found")
    await quizRepo.updatePlayerScore(id, user.userId, score);

    new SuccessResponse("Score updated successfully", {}).send(res);
  } catch (error) {
    errorResponse(error, res);
  }
};


