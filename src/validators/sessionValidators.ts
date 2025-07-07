import { z } from 'zod';

export const CreateSessionSchema = z.object({
    email: z.string().min(1).email('Invalid email format'),
    password: z.string().min(8),
});