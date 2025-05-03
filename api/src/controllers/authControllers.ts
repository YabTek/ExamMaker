import userRepo from '../repositories/userRepositories';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../helpers/generateToken';
import { sendEmail } from '../helpers/sendEmail';


export const register = async (req: Request, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepo.create({
      username,
      email,
      password: hashedPassword,
    });


    res.status(201).json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await userRepo.findByEmail(email );
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const token = generateToken({ userId: user._id });
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
        return res.status(400).json({ message: "User not found" });
      }
  
      await sendEmail(user, email);
  
      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const resetPassword = async (req: Request, res) => {
    try {
      const { newPassword, email } = req.body
      let user = null

      if (email) {
        user = await userRepo.findByEmail(email)
      } else
         return res.status(400).json({ message: "Please provide an email" });
      if (user) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(newPassword, saltRounds)
        const isSame = await bcrypt.compare(newPassword, user.password)
        
        if (isSame)
            return res.status(400).json({ message: "You used this password before, please update it" });

        user.password = passwordHash
        await userRepo.updateInfo(user)
        return res.status(200).json({ message: "Password updated" });
      } else {
        return res.status(400).json({ message: "User not found" });

      }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

  }