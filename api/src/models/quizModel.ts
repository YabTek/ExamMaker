import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Quiz";
export const COLLECTION_NAME = "quizzes";

export interface Quiz {
  _id: Types.ObjectId;
  mode: "solo" | "multiplayer"
  questions: Types.ObjectId[]; 
}

const schema = new Schema<Quiz>({
    mode: { 
        type: Schema.Types.String, 
        enum: ["solo", "multiplayer"], 
        required: true 
    },
    questions: 
        { type: [Schema.Types.ObjectId], 
            ref: "Question" 
        },
    }, 
    {
    timestamps: true,
    versionKey: false,
  });

  
export const QuizModel = model<Quiz>(DOCUMENT_NAME, schema, COLLECTION_NAME);