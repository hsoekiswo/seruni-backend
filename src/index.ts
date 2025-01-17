import express from 'express';
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import { generateAccessToken } from './service';
import { password } from 'bun';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Seruni!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [
    {
        'username': 'hsoekiswo',
        'password': 'password',
        'name': 'Hafizhun Soekiswo',
        'email': 'hsoekiswo@gmail.com',
        'phone': '08212345'
    }
]

app.post('/register', (req: Request, res: Response) => {
    const data = req.body;
    users.push(data);
    res.json(users);
})

app.post('/login', (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const token = generateAccessToken(username, password);
    res.json(token);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});