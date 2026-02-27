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

export interface QuizAttempt {
  _id: string;
  score: number;
  totalQuestions: number;
  percentageScore: number;
  timeSpent: number;
  completedAt: string;
  quizTitle: string;
}

export interface UserStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  recentTrend: { date: string; score: number }[];
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
  startQuiz: (id: string) => api.post(`/startQuiz/${id}`),
  updateScore: (id: string, score: number) => api.post(`/updateScore/${id}`, { score }),
  getTimeLeft: (id: string) => api.get<{ timeLeft: number; started: boolean }>(`/timeLeft/${id}`),
  submitQuizAttempt: (quizId: string, answers: any[], timeSpent: number) => api.post("/submit-attempt", { quizId, answers, timeSpent }),
  getUserAnalytics: () => api.get("/analytics"),
  getAttemptDetail: (attemptId: string) => api.get(`/attempt/${attemptId}`), 
  getUserHistory: (limit: number = 50) => api.get(`/history?limit=${limit}`),
};
