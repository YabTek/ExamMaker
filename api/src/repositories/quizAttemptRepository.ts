import { QuizAttemptModel, QuizAttempt } from "../models/quizAttemptModel";
import { Types } from "mongoose";

async function createAttempt(attemptData: Partial<QuizAttempt>) {
    return QuizAttemptModel.create(attemptData);
}

async function getUserAttempts(userId: Types.ObjectId, limit: number = 20) {
    return QuizAttemptModel.find({userId}).sort({completedAt: -1}).limit(limit).lean();
}

async function getUserStats(userId: Types.ObjectId) {
    const attempts = await QuizAttemptModel.find({userId}).lean();

    if (attempts.length === 0) {
        return {
            totalAttempts: 0,
            averageScore: 0,
            bestScore: 0,
            totalTimeSpent: 0,
            recentTrend: []
        };
    }
    const totalScore = attempts.reduce((sum, a) => sum + a.percentageScore, 0);
    const bestScore = Math.max(...attempts.map(a => a.percentageScore));
    const totalTime = attempts.reduce((sum, a) => sum + a.timeSpent, 0);
    const recentTrend = attempts
    .slice(0, 10)
    .reverse()
    .map(a => ({
      date: a.completedAt,
      score: a.percentageScore
    }));
    
    return {
        totalAttempts: attempts.length,
        averageScore: totalScore / attempts.length,
        bestScore,
        totalTimeSpent: totalTime,
        recentTrend
    };
}

async function getAttemptDetails(attemptId: string) {
  const attempt = await QuizAttemptModel.findById(attemptId)
    .populate('userId', 'username')
    .lean();
  
  if (!attempt) return null;

  const allAttempts = await QuizAttemptModel.find({ quizId: attempt.quizId })
    .sort({ percentageScore: -1, timeSpent: 1 })
    .lean();

  const rank = allAttempts.findIndex(a => a._id.toString() === attemptId) + 1;
  const totalParticipants = allAttempts.length;

  return {
    ...attempt,
    rank,
    totalParticipants
  };
}

async function getUserQuizHistory(userId: string, limit: number = 50) {
  const attempts = await QuizAttemptModel.find({ userId })
    .sort({ completedAt: -1 })
    .limit(limit)
    .populate('quizId', 'questions')
    .lean();

  return attempts.map((attempt, index) => ({
    _id: attempt._id,
    title: generateQuizTitle(attempt.quizTitle, attempts.length - index),
    completedAt: attempt.completedAt,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    percentageScore: attempt.percentageScore
  }));
}

function generateQuizTitle(quizTitle: string, number: number): string {
  if (quizTitle && quizTitle !== 'quiz') {
    return quizTitle;
  }
  return `Quiz ${number}`;
}

export default {
    createAttempt,
    getUserAttempts,
    getUserStats,
    getAttemptDetails,
    getUserQuizHistory,
};