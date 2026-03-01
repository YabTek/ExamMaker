import { Types } from "mongoose";
import { QuizModel, Quiz } from "../models/quizModel";

async function createQuiz(mode: string, questions: Quiz["questions"], player) {
  return QuizModel.create({ mode, questions, players: [
      {
        _id: player._id,
        username: player.username,
        isHost: player.isHost,
      },
    ], });
};

async function getQuizById(id: string){
  return QuizModel.findById(id).lean();
};

async function getAllQuizzes(){
  return QuizModel.find();
};

async function addPlayer(quizId, player) {
  return await QuizModel.findOneAndUpdate(
    { _id: quizId, "players._id": { $ne: player._id } },
    { $push: { players: player } },
    { new: true }
  );
}

async function updateStatus(quizId, playerId) {
  return await QuizModel.findOneAndUpdate(
    { _id: quizId, "players._id": playerId },
    { $set: { "players.$.hasJoined": true } },
    { new: true }
  );
}


async function updatePlayerScore(quizId: string, playerId: string, score: number) {
  const updatedQuiz = await QuizModel.findOneAndUpdate(
    { _id: quizId, "players._id": playerId },
    { $set: { "players.$.score": score } },
    { new: true } 
  );

  return updatedQuiz;
}


export default {
  createQuiz,
  getQuizById,
  getAllQuizzes,  
  addPlayer,
  updatePlayerScore,
  updateStatus
}