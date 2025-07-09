import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from "../errors/NotFoundError.js";
import { EntityAlreadyExists } from "../errors/EntityAlreadyExists.js";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
        return;
    }

    if (err instanceof EntityAlreadyExists) {
        res.status(409).json({ error: err.message });
        return;
    }

    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}