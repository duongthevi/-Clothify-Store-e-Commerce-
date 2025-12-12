const { z } = require("zod");
const { orderItemsSchema } = require("./order_items.schema");

const orderSchema = z.object({
  user_id: z.number().int().positive(),
  order_items: orderItemsSchema.optional(),
  status: z.string().optional(),
});

module.exports = orderSchema;
