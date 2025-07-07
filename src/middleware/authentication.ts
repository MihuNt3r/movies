import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: 'Authorization header missing' });
            return;
        }

        // Check if header follows "Bearer <token>" format
        if (!authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Invalid authorization format. Use: Bearer <token>' });
            return;
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        if (!token) {
            res.status(401).json({ error: 'Token missing' });
            return;
        }

        const jwtSecretKey = process.env.JWT_SECRET;
        if (!jwtSecretKey) {
            res.status(500).json({ error: 'JWT secret not configured' });
            return;
        }

        // Verify the token
        const decoded = jwt.verify(token, jwtSecretKey) as JwtPayload;

        // Add user info to request object
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token expired' });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};