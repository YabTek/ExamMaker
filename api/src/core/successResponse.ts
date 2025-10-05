import { Response } from "express";

export class ParentResponse {
  protected readonly message: string;
  protected readonly data: any;
  protected readonly statusCode: number;

  constructor(message: string, data: any, statusCode: number) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  send(res: Response) {
    return res.status(this.statusCode).json({
      status: "success",
      message: this.message,
      ...this.data,
    });
  }
}

export class SuccessResponse extends ParentResponse {
  constructor(message: string, data: any) {
    super(message, data, 200);
  }
}

export class CreatedResponse extends ParentResponse {
  constructor(message: string, data: any) {
    super(message, data, 201);
  }
}
