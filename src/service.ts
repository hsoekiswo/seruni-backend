import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';

dotenv.config();
const secret = process.env.TOKEN_SECRET;

export const users = [
    {
        'username': 'hsoekiswo',
        'password': 'password',
        'name': 'Hafizhun Soekiswo',
        'email': 'hsoekiswo@gmail.com',
        'phone': '08212345'
    },
    {
        'username': 'ijun',
        'password': 'ijun123',
        'name': 'Ijun',
        'email': 'ijun@mail.com',
        'phone': '0898765'
    }
]

export function registration(data: any) {
    users.push(data);
    return data;
}

export function getUser(id: any) {
    return users[id];
}

export function generateAccessToken(username: any, password: any) {
    const user = users.find(user => user.username === username);

    if (!user) {
        console.error('User not found!');
        return null;
    }

    if (user.password !== password) {
        console.error('Invalid password');
        return null; // or throw an error
    }
    
    const payload = { username: user.username };
    return jwt.sign(payload, secret as string, { expiresIn: '1800s' });
};

interface User {
    username: string;
    password: string;
    iat: number;
    exp: number;
}
  
interface AuthenticatedRequest extends Request {
    user?: User;
};

export const authenticateToken: any = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, payload: any) => {
      console.log('Error:', err);
  
      if (err) {
        return res.sendStatus(403);
      }
  
      (req as AuthenticatedRequest).user = payload; // Cast req to AuthenticatedRequest
  
      next();
    });
};

export const products = [
    {
        name: "Touch For Health - The Complete Edition",
        image: "https://devorss.com/cdn/shop/files/9780875169125_c039adc2-c6ee-4a20-86c1-4f35871552b9.jpg?v=1684360516&width=800",
    },
    {
        name: "Touch for Health Handy Assessment Chart",
        image: "https://devorss.com/cdn/shop/products/300_11x17-Handy-Assessment-Chart-proof-1.jpg?v=1659989315&width=300",
    },
    // Example for post:
    // "name": "Courses 1",
    // "image": "https://pustakalanalibrary.wordpress.com/wp-content/uploads/2024/06/1.png?w=819"
]

export function getProduct(id: any) {
    return products[id];
};

export function addPoduct(data: any) {
    products.push(data);
    return data;
};