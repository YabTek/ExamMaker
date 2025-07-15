import { Response } from "express";
import { AppError } from "./errors"; 

export const errorResponse = (err: any, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};
