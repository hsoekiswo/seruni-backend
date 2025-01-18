import express from 'express';
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import { registration, authenticateToken, generateAccessToken } from './service';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Seruni!');
});


app.post('/register', (req: Request, res: Response) => {
    const data = req.body;
    const users = registration(data);
    res.json(users);
})

app.post('/login', (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const token = generateAccessToken(username, password);

    if (!token) {
        res.status(401).json({ message: 'Invalid username or password' });
    }
    
    res.json(token);
});

app.get('/dashboard', authenticateToken, (req: Request, res: Response) => {
    res.send('Welcome to the dashboard');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});