import express, { Request, Response } from 'express';
import { Table, Column, Model, HasOne, ForeignKey } from 'sequelize-typescript';

const app = express();

app.get('/', (req: Request, res: Response) => {
    console.log({ HasOne })
    res.end('Amogus');
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})