const knex = require("../database/knex");
const Paginator = require("./paginator");
const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

function productRepository() {
  return knex("products");
}

function readProductData(payload) {
  return {
    ...(payload.name && { name: payload.name }),
    ...(payload.description && { description: payload.description }),
    ...(payload.price && { price: payload.price }),
    ...(payload.stock && { stock: payload.stock }),
    ...(payload.size && { size: payload.size }),
    ...(payload.category_id && { category_id: payload.category_id }),
    ...(payload.image_url && { image_url: payload.image_url }),
  };
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getAllProducts(query) {
  const { page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  const results = await productRepository()
    .select(
      knex.raw("COUNT(id) OVER() AS record_count"),
      "id",
      "name",
      "description",
      "price",
      "stock",
      "image_url",
      "category_id",
      "size"
    )
    .orderBy("id", "asc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;
  const products = results.map((product) => {
    product.record_count = undefined;
    return product;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    products,
  };
}

async function getProductById(id) {
  return productRepository().where("id", id).first();
}

async function getProductByCategoryId(categoryId, query = {}) {
  const { page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  const results = await productRepository()
    .where({ category_id: categoryId })
    .select(
      knex.raw("COUNT(id) OVER() AS record_count"),
      "id",
      "name",
      "description",
      "price",
      "stock",
      "image_url",
      "category_id",
      "size"
    )
    .orderBy("id", "desc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const products = results.map((product) => {
    product.record_count = undefined;
    return product;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    products,
  };
}

async function searchProducts({ search = "", page = 1, limit = 5 }) {
  const paginator = new Paginator(page, limit);

  const baseQuery = productRepository().modify((builder) => {
    if (search.trim()) {
      builder.where((qb) => {
        qb.where("name", "ilike", `%${search}%`).orWhere(
          "description",
          "ilike",
          `%${search}%`
        );
      });
    }
  });

  const results = await baseQuery
    .select(
      knex.raw("COUNT(id) OVER() AS record_count"),
      "id",
      "name",
      "description",
      "price",
      "stock",
      "image_url",
      "category_id",
      "size"
    )
    .orderBy("id", "desc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results.length > 0 ? Number(results[0].record_count) : 0;
  const products = results.map(({ record_count, ...rest }) => rest);

  return {
    metadata: paginator.getMetadata(totalRecords),
    products,
  };
}

async function createProduct(payload) {
  const productData = readProductData(payload);
  const [insertedProduct] = await productRepository()
    .insert(productData)
    .returning("*");
  return insertedProduct;
}

async function updateProduct(id, payload) {
  const product = await getProductById(id);
  if (!product) return null;

  const updateFields = readProductData(payload);
  if (Object.keys(updateFields).length > 0) {
    await productRepository().where("id", id).update(updateFields);
  }

  return {
    ...product,
    ...updateFields,
  };
}

async function deleteProduct(id) {
  const product = await getProductById(id);
  if (!product) return null;

  await productRepository().where("id", id).del();
  return product;
}

async function uploadImageToS3(file) {
  const key = `products/${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  getProductByCategoryId,
  updateProduct,
  deleteProduct,
  uploadImageToS3,
};
