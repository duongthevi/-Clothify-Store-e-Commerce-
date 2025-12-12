const { z } = require("zod");

const orderItemSchema = z.object({
  product_id: z.number().int().optional(),
  quantity: z.number().int().positive().optional(),
  price: z.number().int().positive().optional(),
});

const orderItemsSchema = z.array(orderItemSchema).min(1);

module.exports = {
  orderItemSchema,
  orderItemsSchema,
};
