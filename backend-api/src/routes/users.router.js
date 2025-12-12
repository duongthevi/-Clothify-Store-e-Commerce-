const express = require("express");
const userController = require("../controllers/user.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/users", router);

  // Lấy thông tin người dùng đang đăng nhập
  router.get("/me", authMiddleware, userController.getMyInfo);
  router.put("/me", authMiddleware, userController.updateMyInfo);

  // Lấy tất cả người dùng
  router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);

  // Lấy thông tin người dùng theo id
  router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    userController.getUserById
  );

  // Chỉnh sửa thông tin người dùng
  router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    userController.updateUser
  );

  // Xóa người dùng
  router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    userController.deleteUser
  );
};
