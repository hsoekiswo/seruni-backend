import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import type { NextFunction, Request, Response } from 'express';
import { registration, authenticateToken, generateAccessToken, getUser, getProduct, addPoduct, getProducts, updateProduct, deleteProduct } from './service';
import "./db";
import { existsSync } from "fs";
import { execSync } from "child_process";

const app = express();
const port = 3000;

// Set up seed
if (!existsSync("seruni.sqlite")) {
    console.log("Database not found, running seed script...");
    execSync("bun run src/seed.ts", {stdio: "inherit"});
}

// Configure CORS middleware to allow requests from your frontend
const corsOptions = {
    origin: [process.env.URL_DEV as string, process.env.URL_PROD as string],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

interface CustomRequest extends Request {
    id?: string;
}

app.get('/', (req: Request, res: Response) => {
    res.send('Hello this is Seruni backend page!');
});

app.post('/register', (req: Request, res: Response) => {
    const data = req.body;
    const users = registration(data);
    res.json(users);
});

app.param('id', (req: CustomRequest, res: Response, next: NextFunction, id: string) => {
    req.id = id;
    next();
});

app.get('/users/:id', (req: CustomRequest, res: Response) => {
    const id = req.id;
    const data = getUser(id);
    res.json(data);
});

app.post('/login', (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const token = generateAccessToken(username, password);

    if (!token) {
        res.status(401).json({ message: 'Invalid username or password' });
    }
    
    res.json(token);
});

app.get('/products/:id', (req: CustomRequest, res: Response) => {
    const id = req.id;
    const data = getProduct(id);
    res.json(data);
});

app.get('/products', (req: CustomRequest, res: Response) => {
    const search = typeof req.query.search === "string" ? req.query.search : null;;
    const tags = typeof req.query.tags === "string" ? req.query.tags : null;;
    const data = getProducts(search, tags);
    res.json(data);
});

app.post('/products', (req: CustomRequest, res: Response) => {
    const data = req.body;
    const products = addPoduct(data);
    res.json(products);
});

app.patch('/products/:id', (req: CustomRequest, res: Response) => {
    const id = req.id;
    const data = req.body;
    const result = updateProduct(id, data);
    res.json(result);
})

app.delete('/products/:id', (req: CustomRequest, res: Response) => {
    const id = req.id;
    const result = deleteProduct(id);
    res.json(result);
})

app.options('*', cors(corsOptions));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});