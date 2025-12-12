const { z } = require("zod");

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number()),
  category_id: z.preprocess((val) => Number(val), z.number()),
  stock: z.preprocess((val) => Number(val), z.number()),
  size: z.string().min(1, "Size is required"),
  image_url: z.string().url("Invalid URL format").optional(),
});

module.exports = {
  productSchema,
};
