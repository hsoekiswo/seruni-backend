import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";
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
        return query.get(username);
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
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            console.log("Login successful!");
          } else {
            console.error('Invalid password');
            return null;
          }
        })

        // Step 4: If password is valid, generate JWT
        const payload = { username: user.username, name: user.name, role: user.role };
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

export function getProducts(search: string | null , tags: string | null) {
    let getProducts = `
      SELECT * 
      FROM products 
      WHERE
        (name LIKE $search
        OR description LIKE $search)
      `;
    
      const tagArray = typeof tags === 'string' ? tags.split(',') : tags;
      if (tagArray && tagArray.length > 0) {
        const placeholders = tagArray.map((_, index) => `$tag${index}`).join(', ');
        getProducts += ` AND tags IN (${placeholders})`;
    }

    const query = db.query(getProducts);

    const params: any = {
      $search: search ? `%${search}%` : `%`,
    };
    if (tagArray && tagArray.length > 0) {
      tagArray.forEach((tag, index) => {
          params[`$tag${index}`] = tag;
      });
    }

    const result = query.all(params);

    return result;
}

export function updateProduct(id: any, data: any) {
  const currentProduct = db.query(`SELECT * FROM products WHERE id = $id`).get({$id: id});

  const updatedProduct = `UPDATE products SET name = $name, image = $image, description = $description, price = $price, tags = $tags WHERE id = $id`
  db.run(updatedProduct, {$name: data.name ?? currentProduct.name, $image: data.image ?? currentProduct.image, $description: data.description ?? currentProduct.description, $price: data.price ?? currentProduct.price, $id: id, $price: data.tags ?? currentProduct.tags, $id: id })
  const updatedData = getProduct(id);

  return updatedData;
}

export function addPoduct(data: any) {
    const registerProduct = `INSERT INTO products(name, image, description, price, tags) VALUES ($name, $image, $description, $price, $tags)`;
    db.run(registerProduct, [data.name, data.image, data.description, data.price, data.tags]);

    return {message: "Successfully input product item", data};
};

export function deleteProduct(id: string) {
  const deleteProduct = `DELETE FROM products WHERE id = $id`
  db.run(deleteProduct, [id]);

  return {message: "Successfully delete product"}
}

export function encryptPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};