import {Schema, model, Types} from "mongoose";

export const DOCUMENT_NAME = "QuizAttempt";
export const COLLECTION_NAME = "quiz_attempts";


export interface QuizAttempt {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    quizId: Types.ObjectId;
    score: number;
    totalQuestions: number;
    percentageScore: number;
    timeSpent: number;
    answers: {
        questionId: string;
        userAnswer: number;
        correctAnswer: number;
        isCorrect: boolean;
    }[];
    completedAt: Date;
    quizTitle: string;
}

const schema = new Schema<QuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentageScore: { type: Number, required: true },
    timeSpent: { type: Number, required: true },
    answers: [
      {
        questionId: { type: String, required: true },
        userAnswer: { type: Number, required: true },
        correctAnswer: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    completedAt: { type: Date, default: Date.now },
    quizTitle: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

schema.index({ userId: 1, completedAt: -1 });

export const QuizAttemptModel = model<QuizAttempt>(DOCUMENT_NAME, schema, COLLECTION_NAME);
