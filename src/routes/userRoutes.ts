import express, { Request, Response } from 'express';
import { createUser } from "../services/userService.js";
import { CreateUserSchema } from "../validators/userValidators.js";
import { CreateUserDto } from "../dtos/userDtos.js";

const router = express.Router();

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