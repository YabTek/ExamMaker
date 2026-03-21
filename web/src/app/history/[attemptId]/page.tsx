"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { quizApi } from "@/services/quizApi";
import PDFExportButton from "@/components/PDFExportButton";

interface AttemptDetail {
  _id: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentageScore: number;
  timeSpent: number;
  completedAt: string;
  rank: number;
  totalParticipants: number;
  answers: Array<{
    questionId: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }>;
  userId: {
    username: string;
  };
}

interface Question {
  question: string;
  choices: string[];
  correct_answer: number;
}

export default function QuizDetailPage() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await quizApi.getAttemptDetail(attemptId as string);
        setAttempt(res.data);
        
        const quizRes = await quizApi.fetchQuiz(res.data.quizId, true);
        setQuestions(quizRes.data.questions);
      } catch (err) {
        console.error("Failed to load attempt details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-teal-600/20 via-cyan-400/40 to-teal-700/40"></div>
        <div className="fixed inset-0 bg-gradient-to-tr from-teal-700 via-transparent to-teal-700 animate-pulse"></div>
        
        <div className="fixed top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
        <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-blue-900 font-semibold text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-teal-600/20 via-cyan-400/40 to-teal-700/40"></div>
        <div className="fixed inset-0 bg-gradient-to-tr from-teal-700 via-transparent to-teal-700 animate-pulse"></div>
        
        <div className="fixed top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
        <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-red-600 font-semibold">Quiz not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-teal-600/20 via-cyan-400/40 to-teal-700/40"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-teal-700 via-transparent to-teal-700 animate-pulse"></div>
      
      <div className="fixed top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl"></div>
      
      <div className="relative py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-cyan-500/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-white/40">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-blue-900 mb-2">{attempt.quizTitle}</h1>
                <p className="text-blue-800">
                  Completed on {new Date(attempt.completedAt).toLocaleString()}
                </p>
              </div>
              <PDFExportButton attempt={attempt} questions={questions} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-700/50 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-white text-3xl font-bold">{attempt.score}/{attempt.totalQuestions}</div>
                <div className="text-cyan-100 text-sm">Score</div>
              </div>
              <div className="bg-blue-700/50 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-white text-3xl font-bold">{attempt.percentageScore.toFixed(1)}%</div>
                <div className="text-cyan-100 text-sm">Percentage</div>
              </div>
              <div className="bg-blue-700/50 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-white text-3xl font-bold">#{attempt.rank}</div>
                <div className="text-cyan-100 text-sm">Rank</div>
              </div>
              <div className="bg-blue-700/50 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-white text-3xl font-bold">{attempt.totalParticipants}</div>
                <div className="text-cyan-100 text-sm">Participants</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((question, idx) => {
              const userAnswer = attempt.answers[idx];
              const isCorrect = userAnswer?.isCorrect;

              return (
                <div
                  key={idx}
                  className="bg-cyan-500/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/40"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-blue-900">{question.question}</h3>
                  </div>

                  <div className="space-y-2 ml-11">
                    {question.choices.map((choice, choiceIdx) => {
                      const isUserAnswer = userAnswer?.userAnswer === choiceIdx;
                      const isCorrectAnswer = question.correct_answer === choiceIdx;

                      return (
                        <div
                          key={choiceIdx}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? "bg-green-100 border-green-500"
                              : isUserAnswer && !isCorrect
                              ? "bg-red-100 border-red-500"
                              : "bg-white/50 border-white/60"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCorrectAnswer && <span className="text-green-600 font-bold">✓</span>}
                            {isUserAnswer && !isCorrect && <span className="text-red-600 font-bold">✗</span>}
                            <span className="text-blue-900">{choice}</span>
                            {isUserAnswer && <span className="ml-auto text-xs text-blue-700 font-semibold">Your Answer</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}