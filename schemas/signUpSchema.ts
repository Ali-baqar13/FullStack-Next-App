import { z } from "zod";


export const userNameValidation = z
    .string()
    .min(2, 'username must be at least 2 characters')
    .max(20, 'username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'username can only contain letters, numbers, and underscores');

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, 'password must be at least 6 characters').max(100, 'password must be at most 100 characters'),

})
        