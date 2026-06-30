import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
    username: z.string().trim().min(3, "Username must be at least 3 characters"),
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});