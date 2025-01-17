import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.TOKEN_SECRET;

export function generateAccessToken(username: any, password: any) {
    const payload = {
        username: username,
        password: password
    }
    return jwt.sign(payload, secret, { expiresIn: '1800s' });
};