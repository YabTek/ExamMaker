import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Question";
export const COLLECTION_NAME = "questions";

export interface Question {
   _id: Types.ObjectId 
   question: string;
   choices: string[]; 
   correct_answer: number;  

} 

const schema = new Schema<Question>({
    question: {
        type: Schema.Types.String,
        required: true,
    },
    choices: {
        type: [Schema.Types.String],
        required: true,
    },
    correct_answer: {
        type: Schema.Types.Number,
        required: true,
    },
    },
    {
    timestamps: true,
    versionKey: false,
})

export const QuestionModel = model<Question>(DOCUMENT_NAME, schema, COLLECTION_NAME)





