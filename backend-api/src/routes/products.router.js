const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

module.exports.setup = (app) => {
    app.use('/api/products', router);

    router.get('/category/:categoryId', productsController.getProductsByCategoryId);
    router.get('/search', productsController.searchProducts);
    
    router.get('/', productsController.getAllProducts);
    router.get('/:id', productsController.getProductById);
    router.post('/', authMiddleware, adminMiddleware, upload.single('image'), productsController.createProduct);
    router.patch('/:id', authMiddleware, adminMiddleware, upload.single('image'), productsController.updateProduct);
    router.delete('/:id', authMiddleware, adminMiddleware, productsController.deleteProduct);
};