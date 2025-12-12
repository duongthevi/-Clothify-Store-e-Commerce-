const { z } = require("zod");

const userSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(30, "Name must not exceed 30 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional(),
    role: z.enum(["user", "admin"]).default("user"),
    address: z
      .string()
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must not exceed 100 characters")
      .optional(),
  })
  .strict();

const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(30, "Name must not exceed 30 characters")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional(),
    role: z.enum(["user", "admin"]).optional(),
    address: z
      .string()
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must not exceed 100 characters")
      .optional(),
    phone_number: z
      .string()
      .min(10, "Phone number must be at least 10 characters long")
      .max(15, "Phone number must not exceed 15 characters")
      .optional(),
  })
  .strict();

module.exports = {
  userSchema,
  updateUserSchema,
};
