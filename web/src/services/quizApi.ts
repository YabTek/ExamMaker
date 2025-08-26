import api from "./common";

export interface Question {
  question: string;
  choices: string[];
  correct_answer: number;
}

export interface CreateQuizRequest {
  language: string;
  mode: "solo" | "group";
}

export interface CreateQuizResponse {
  quizId: string;
  questions: Question[];
}

export const quizApi = {
  createQuiz: (data: CreateQuizRequest) => api.post<CreateQuizResponse>("/createQuiz", data),
};
