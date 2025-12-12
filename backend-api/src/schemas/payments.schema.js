const { z } = require("zod");

const paymentSchema = z.object({
  order_id: z.number().int().positive(),
  amount: z.number().nonnegative(),
  status: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  payment_method: z.string().min(1),
});

const pratialPaymentSchema = paymentSchema.partial();

module.exports = {
  paymentSchema,
  pratialPaymentSchema,
};
