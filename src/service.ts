import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';
import db from './db';

dotenv.config();
const secret = process.env.TOKEN_SECRET;

export function registration(data: any) {
    const registerUser = `INSERT INTO users(username, password, name, email, phone) VALUES ($username, $password, $name, $email, $phone)`;
    db.run(registerUser, [data.username, data.password, data.name, data.email, data.phone]);

    return {message: "Successfully registered", data};
}

export function getUser(id: any) {
    const getUser = `SELECT * FROM users WHERE id = $id`;
    const query = db.query(getUser);
    const result = query.get({
        $id: id,
    });

    return result;
}

export function generateAccessToken(username: any, password: any) {
    const getUserByUsername = (username: string) => {
        const query = db.query("SELECT * FROM users WHERE username = ?");
        return query.get(username);  // Returns a single user or null if not found
      };
      
      const authenticateUser = (username: string, password: string) => {
        // Step 1: Retrieve user from database by username
        const user = getUserByUsername(username);
      
        // Step 2: Check if user exists
        if (!user) {
          console.error('User not found!');
          return null;
        }
      
        // Step 3: Compare the provided password with the stored password
        if (user.password !== password) {
          console.error('Invalid password');
          return null;  // Invalid password
        }
      
        // Step 4: If password is valid, generate JWT
        const payload = { username: user.username };
        return jwt.sign(payload, secret, { expiresIn: '1800s' });  // Create the JWT
    };
    
    const token = authenticateUser(username, password);

    return token;
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

export function getProduct(id: any) {
    const getProduct = `SELECT * FROM products WHERE id = $id`;
    const query = db.query(getProduct);
    const result = query.get({
        $id: id,
    });

    return result;
};

export function getProducts() {
    const getProducts = `SELECT * FROM products`;
    const query = db.query(getProducts);
    const result = query.all();

    return result;
}

export function addPoduct(data: any) {
    const registerUser = `INSERT INTO products(name, image, description, price) VALUES ($name, $image, $description, $price)`;
    db.run(registerUser, [data.name, data.image, data.description, data.price]);

    return {message: "Successfully input product item", data};
};