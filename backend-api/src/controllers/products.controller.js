const productsService = require("../services/products.service");
const { productSchema } = require("../schemas/products.schema");
const ApiError = require("../utils/api-error");
const JSend = require("../utils/jsend");

const getAllProducts = async (req, res, next) => {
  let result = {
    products: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  try {
    result = await productsService.getAllProducts(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
  return res.status(200).json(
    JSend.success({
      products: result.products,
      metadata: result.metadata,
    })
  );
};

const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await productsService.getProductById(productId);
    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }
    return res.status(200).json(JSend.success(product));
  } catch (error) {
    next(error);
  }
};

const getProductsByCategoryId = async (req, res, next) => {
  try {
    const result = await productsService.getProductByCategoryId(
      req.params.categoryId
    );
    return res.status(200).json(
      JSend.success({
        products: result.products,
        metadata: result.metadata,
      })
    );
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const result = await productsService.searchProducts(req.query);
    return res.status(200).json(
      JSend.success({
        products: result.products,
        metadata: result.metadata,
      })
    );
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await productsService.uploadImageToS3(req.file);
    }

    const productData = {
      ...req.body,
      image_url: imageUrl,
    };

    const result = productSchema.safeParse(productData);
    if (!result.success) {
      return next(
        new ApiError(400, "Validation failed", {
          errors: result.error.errors,
        })
      );
    }

    const product = await productsService.createProduct(productData);
    return res.status(201).json(JSend.success(product));
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image_url = await productsService.uploadImageToS3(req.file);
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    if (Object.keys(updateData).length === 0) {
      return next(new ApiError(400, "No data to update"));
    }

    const updated = await productsService.updateProduct(productId, updateData);
    if (!updated) {
      return next(new ApiError(404, "Product not found"));
    }

    return res.status(200).json(
      JSend.success({
        message: "Product updated successfully",
      })
    );
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const deleted = await productsService.deleteProduct(productId);
    if (!deleted) {
      return next(new ApiError(404, "Product not found"));
    }

    return res.status(200).json(
      JSend.success({
        message: "Product deleted successfully",
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
