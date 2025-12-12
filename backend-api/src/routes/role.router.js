const express = require("express");
const roleController = require("../controllers/role.controller");
const validate = require("../middlewares/validateMiddleware");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/roles", router);

  // Lấy tất cả vai trò
  router.get("/", adminMiddleware, roleController.getAllRoles);
  // Lấy vai trò theo id
  router.get("/:id", authMiddleware, roleController.getRoleById);
  // Tạo vai trò mới
  router.post(
    "/",
    adminMiddleware,
    validate(roleController.createRoleSchema),
    roleController.createRole
  );
  // Cập nhật vai trò
  router.put(
    "/:id",
    adminMiddleware,
    validate(roleController.updateRoleSchema),
    roleController.updateRole
  );
  // Xóa vai trò
  router.delete("/:id", adminMiddleware, roleController.deleteRole);
};
