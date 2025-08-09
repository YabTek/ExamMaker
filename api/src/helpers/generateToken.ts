import jwt from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
};

