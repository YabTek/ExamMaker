import userRepo from '../repositories/userRepositories';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../helpers/generateToken';
import { sendEmail } from '../helpers/sendEmail';
import { BadRequestError, NotFoundError } from '../core/errors';
import { CreatedResponse, SuccessResponse } from '../core/successResponse';
import { errorResponse } from '../core/errorResponse';


export const register = async (req: Request, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUserByEmail = await userRepo.findByEmail(email);
    const existingUserByUsername = await userRepo.findByUsername(username);
    
    if (existingUserByEmail || existingUserByUsername) {
     throw new BadRequestError("User exists with this email or username");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepo.create({
      username,
      email,
      password: hashedPassword,
    });

    new CreatedResponse("User registered successfully", newUser)
  } catch (error) {
    errorResponse(error, res);
  }
};

export const login = async (req: Request, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await userRepo.findByEmail(email );
      if (!user) {
        throw new BadRequestError("Invalid email or password");
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new BadRequestError("Invalid email or password");
      }
  
      const token = generateToken({ userId: user._id, username: user.username });
  
      new SuccessResponse("Login successful", 
        { token, user: { id: user._id, username: user.username, email: user.email } }).send(res);
    } catch (error) {
       errorResponse(error, res);
    }
  };
  
  
  export const logout = async (req: Request, res) => {
    try {
      res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  export const requestPasswordReset = async (req: Request, res) => {
    try {
      const { email } = req.body;
  
      const user = await userRepo.findByEmail(email);
      if (!user) {
        throw new NotFoundError("User not found");
      }
  
      await sendEmail(user, email);
      
      new SuccessResponse("Password reset email sent", {}).send(res);
    } catch (error) {
      errorResponse(error, res);
    }
  };

  export const resetPassword = async (req: Request, res) => {
    try {
      const { newPassword, email } = req.body
      let user = null

      if (email) {
        user = await userRepo.findByEmail(email)
      } else
         throw new BadRequestError("Please provide a valid email");
      if (user) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(newPassword, saltRounds)
        const isSame = await bcrypt.compare(newPassword, user.password)
        
        if (isSame)
            throw new BadRequestError("You used this password before, please update it");

        user.password = passwordHash
        await userRepo.updateInfo(user)
        return res.status(200).json({ message: "Password updated" });
      } else {
        throw new NotFoundError("User not found");

      }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

  }