import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(422).json({
                error: 'Validation failed',
                details: result.error.flatten(),
            });
            return;
        }

        next();
    };
}

// Not working for some reason
export const validateQuery = <T>(schema: ZodSchema<T>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            res.status(400).json({
                error: 'Invalid query parameters',
                details: result.error.flatten() });
            return;
        }

        next();
    };