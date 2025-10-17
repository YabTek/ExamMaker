import { Types } from "mongoose";
import { UserModel, User } from "../models/userModel";

async function create(userData: { username: string; email: string; password: string }): Promise<User> {
  return UserModel.create(userData);
}

async function findByEmail(email: string): Promise<User | null> {
  return UserModel.findOne({ email }).exec();
}

async function findByUsername(username: string): Promise<User | null> {
  return UserModel.findOne({username}).exec();
}

async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id }).lean().exec();
}

async function updateInfo(user: User): Promise<User | null> {
    return UserModel.findByIdAndUpdate(user._id, user, { new: true }).lean().exec();
  }

export default {
  create,
  findByEmail,
  findByUsername,
  findById,
  updateInfo,
};
