import { Schema, model } from "mongoose";

export const DOCUMENT_NAME = "Score";
export const COLLECTION_NAME = "scores";

export interface Score {
  quiz: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  score: number;
  rank: number;
}

const ResultSchema = new Schema<Score>(
  {
    quiz: {
         type: Schema.Types.ObjectId, 
         ref: "Quiz", 
         required: true
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    score: { 
        type: Schema.Types.Number, 
        required: true 
    },
    rank: { 
        type: Schema.Types.Number, 
        required: true 
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

export const ResultModel = model<Score>(DOCUMENT_NAME, ResultSchema, COLLECTION_NAME);