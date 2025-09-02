import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Quiz";
export const COLLECTION_NAME = "quizzes";

export interface Quiz {
  _id: Types.ObjectId;
  mode: "solo" | "multiplayer";
  questions: {
    question: string;
    choices: string[];
    correct_answer: number; 
  }[];
  players: { 
    id: string; 
    username: string;
    isHost: boolean;
  }[];
}

const schema = new Schema<Quiz>(
  {
    mode: {
      type: String,
      enum: ["solo", "group"],
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        choices: { type: [String], required: true },
        correct_answer: { type: Number, required: true },
      },
    ],
    players: [
      {
        id: { type: String, required: true },
        username: { type: String, unique: true, required: true },
        isHost: {type: Boolean, required: false, default: false}
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const QuizModel = model<Quiz>(DOCUMENT_NAME, schema, COLLECTION_NAME);
