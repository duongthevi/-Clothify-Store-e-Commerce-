const express = require("express");
const router = express.Router();

const paymentsController = require("../controllers/payments.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const paymentSchema = require("../schemas/payments.schema");
const errorController = require("../controllers/errors.controller");

module.exports.setup = (app) => {
  app.use("/api/payments", router);

  router.get("/",authMiddleware, adminMiddleware, paymentsController.getAllPayments);

  // Lấy payment theo id (admin hoặc user liên quan)
  router.get("/:id", authMiddleware, paymentsController.getPaymentbyId);

  // Lấy payment theo user id (user liên quan)
  router.get(
    "/user/:userId",
    authMiddleware,
    paymentsController.getPaymentByUserId
  );

  // Tạo payment mới (user)
  router.post(
    "/",
    authMiddleware,
    validate(paymentSchema.paymentSchema),
    paymentsController.createPayment
  );

  // Cập nhật status payment (admin)
  router.patch(
    "/:id", 
    authMiddleware,
    adminMiddleware,
    validate(paymentSchema.pratialPaymentSchema),
    paymentsController.updatePayment
  );
};