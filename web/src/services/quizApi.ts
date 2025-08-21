import api from "./common";

// Match your backend Quiz model
export interface Question {
  question: string;
  choices: string[];
  correct_answer: number;
}

export interface CreateQuizRequest {
  language: string;
  mode: "solo" | "multiplayer";
}

export interface CreateQuizResponse {
  quizId: string;
  questions: Question[];
}

export const quizApi = {
  createQuiz: (data: CreateQuizRequest) =>
    api.post<CreateQuizResponse>("/createQuiz", data),
};
