import express, { Request, Response } from 'express';
import { createSession } from "../services/sessionService.js";
import { CreateSessionSchema } from "../validators/sessionValidators.js";
import { SessionCreateDto } from "../dtos/sessionDtos.js";

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const parsed = CreateSessionSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        return;
    }

    const { token } = await createSession(req.body as SessionCreateDto);
    res.json({ token });
});

export default router;