import api from "./common";

export interface Question {
  question: string;
  choices: string[];
  correct_answer: number;
}

export interface Players {
  _id: string;
  username: string;
  score: number;
  isHost: boolean;
}

export interface CreateQuizRequest {
  language: string;
  mode: "solo" | "group";
}

export interface CreateQuizResponse {
  quizId: string;
}

export interface FetchQuizResponse {
  quizId: string;
  questions: Question[];
  players: Players[];
}

export const quizApi = {
  createQuiz: (data: CreateQuizRequest) => api.post<CreateQuizResponse>("/createQuiz", data),
  fetchQuiz: (id: string) => api.get<FetchQuizResponse>(`/fetchQuiz/${id}`),
  joinQuiz: (id: string) => api.post(`/joinQuiz/${id}`),
  updateScore: (id: string, score: number) => api.post(`/updateScore/${id}`, { score }),
};
