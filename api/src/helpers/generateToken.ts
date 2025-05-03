import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY; 

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};