import fs from "fs/promises";
import path from "path";
import { BadRequestError } from "../core/errors";
import { CreatedResponse } from "../core/successResponse";
import quizRepo from "../repositories/quizRepository";
import { Request } from "express";
import { errorResponse } from "../core/errorResponse";

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

export const createQuiz = async (req: Request, res) => {
  try {
    const { language, mode } = req.body;
    if (!language || !mode) {
      throw new BadRequestError("Language and mode are required");
    }

    const questions = await loadQuestions(language.toLowerCase(), 15);
    const quiz = await quizRepo.createQuiz(mode.toLowerCase(), questions);

    new CreatedResponse("Quiz created successfully", {quizId: quiz._id,questions: quiz.questions}).send(res);
  } catch (error) {
    errorResponse(error, res);
  }
};
