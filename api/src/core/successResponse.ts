import { Response } from "express";

export class SuccessResponse {
  private readonly message: string;
  private readonly data: any;
  private readonly statusCode: number;

  constructor(message: string, data: any, statusCode: number = 200) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  send(res: Response) {
    return res.status(this.statusCode).json({
      status: "success",
      message: this.message,
      data: this.data,
    });
  }
}
