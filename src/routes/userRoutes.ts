import express, { Request, Response } from 'express';
import { createUser } from "../services/userService.ts";
import { CreateUserSchema } from "../validators/userValidators.ts";
import { CreateUserDto } from "../dtos/userDtos.ts";

const router = express.Router();

// POST /users
router.post('/', async (req: Request, res: Response) => {
    const parsed = CreateUserSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        return;
    }

    const { token } = await createUser(parsed.data as CreateUserDto);
    res.json({ token });
});

export default router;