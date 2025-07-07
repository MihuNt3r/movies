import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.string().min(1).email('Invalid email format'),
    name: z.string().min(1).min(2, ).max(50),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});