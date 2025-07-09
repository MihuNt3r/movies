import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.string().min(1).email('Invalid email format'),
    name: z.string().trim().min(1).min(2, ).max(50),
    password: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
    confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});