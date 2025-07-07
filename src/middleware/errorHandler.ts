import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from "../errors/NotFoundError.ts";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.log('in middleware');
    if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
        return;
    }

    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}