const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');
const validate = require('../middlewares/validateMiddleware');
const { categorySchema } = require('../schemas/categories.schema');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

module.exports.setup = (app) => {
    app.use('/api/categories', router);
    router.get('/', categoriesController.getAllCategories);
    router.get('/:id', categoriesController.getCategoryById);
    router.post('/', authMiddleware, adminMiddleware, validate(categorySchema), categoriesController.createCategory);
    router.patch('/:id', authMiddleware, adminMiddleware, validate(categorySchema), categoriesController.updateCategory);
    router.delete('/:id', authMiddleware, adminMiddleware, categoriesController.deleteCategory);
};
