import { Request, Response } from 'express';

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Seruni!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});