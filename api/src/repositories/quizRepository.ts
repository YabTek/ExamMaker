import { QuizModel, Quiz } from "../models/quizModel";

async function createQuiz(mode: string, questions: Quiz["questions"]) {
  return QuizModel.create({ mode, questions });
};

async function getQuizById(id: string){
  return QuizModel.findById(id);
};

async function getAllQuizzes(){
  return QuizModel.find();
};


export default {
  createQuiz,
  getQuizById,
  getAllQuizzes,  
}