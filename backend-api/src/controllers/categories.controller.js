const categoriesService = require("../services/categories.service");
const ApiError = require("../utils/api-error");
const JSend = require("../utils/jsend");

const getAllCategories = async (req, res, next) => {
  try {
    const result = await categoriesService.getAllCategories(req.query);

    return res.status(200).json(
      JSend.success({
        categories: result.categories,
        metadata: result.metadata,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    const category = await categoriesService.getCategoryById(categoryId);
    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }
    return res.status(200).json(JSend.success(category));
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoriesService.createCategory(req.body);
    return res.status(201).json(JSend.success(category));
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const categoryData = req.body;

  try {
    const updatedCategory = await categoriesService.updateCategory(
      categoryId,
      categoryData
    );
    if (!updatedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    return res.status(200).json(JSend.success(updatedCategory));
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await categoriesService.deleteCategory(categoryId);
    if (!deletedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    return res
      .status(200)
      .json(JSend.success({ message: "Category deleted successfully" }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
