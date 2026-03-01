import { QuestionModel, Question } from "../models/questionModel";
import { Types } from "mongoose";

async function create(questions: string[]): Promise<Question[]> {
  return QuestionModel.insertMany(questions);
}

async function findById(id: Types.ObjectId): Promise<Question | null> {
  return QuestionModel.findById(id).exec();
}

export default{
    create,
    findById,
}