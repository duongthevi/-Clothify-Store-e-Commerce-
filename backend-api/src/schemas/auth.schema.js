const { z } = require("zod");

const registerSchema = z
  .object({
    name: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["user", "admin"]).default("user"),
  })
  .strict();

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();

const updateUserSchema = z
  .object({
    name: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["user", "admin"]).optional(),
  })
  .strict();

module.exports = { registerSchema, loginSchema, updateUserSchema };
