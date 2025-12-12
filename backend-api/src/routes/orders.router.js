const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders.controller");
const orderItemsController = require("../controllers/order_items.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const orderSchema = require("../schemas/order.schema");
const { orderItemSchema } = require("../schemas/order_items.schema");

module.exports.setup = (app) => {
  app.use("/api/orders", router);

  // Lấy tất cả đơn hàng
  router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    orderController.getAllOrders
  );

  // Lấy đơn hàng theo id
  router.get("/:id", authMiddleware, orderController.getOrderById);

  // Lấy đơn hàng theo user_id
  router.get(
    "/user/:userId",
    authMiddleware,
    orderController.getOrdersByUserId
  );
  

  // Chi tiết đơn hàng bao goồm các sản phẩm
  // (cần xác thực người dùng)
  router.get(
    "/order_items/:id",
    authMiddleware,
    orderItemsController.getOrderItemById
  );
  
  // Lấy tất cả sản phẩm trong đơn hàng
  router.get(
    "/:id/items",
    authMiddleware,
    orderItemsController.getAllOrderItemsByOrderId
  );

  // Tạo đơn hàng mới
  router.post(
    "/",
    authMiddleware,
    validate(orderSchema),
    orderController.createOrder
  );

  router.post(
    "/:id/items",
    authMiddleware,
    validate(orderItemSchema),
    orderItemsController.createOrderItem
  );


  router.put(
    "/order_items/:id",
    authMiddleware,
    validate(orderItemSchema),
    orderItemsController.updateOrderItem
  );

  // Xóa 1 sản phẩm trong đơn hàng
  router.delete(
    "/order_items/:id",
    authMiddleware,
    orderItemsController.deleteOrderItem
  );

//lấy tất cả đơn hàng của người dùng
  router.get(
    "/user/:userId/orders",
    authMiddleware,
    orderController.getOrdersByUserId
  );


  // Cập nhật đơn hàng
  router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validate(orderSchema),
    orderController.updateOrder
  );
};
