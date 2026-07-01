import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
    username: z.string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .transform((value) => value.toLowerCase()),
    email: z.string()
        .trim()
        .email("Invalid email")
        .transform((value) => value.toLowerCase()),

    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
    identifier: z.string()
        .trim()
        .min(3, "username or email is required")
        .transform((value) => value.toLowerCase()),
    password: z.string().min(6, "Password must be at least 6 characters"),
});