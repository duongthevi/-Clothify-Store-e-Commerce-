const UserService = require("../services/user.service");
const RoleService = require("../services/role.service");
const ApiError = require("../utils/api-error");
const JSend = require("../utils/jsend");

// Lấy thông tin người dùng theo id
async function getUserById(req, res, next) {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(id);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    // trả về role người dùng
    const role = await RoleService.getRoleById(user.role_id);
    user.role = role ? role.name : "Unknown";

    return res.json(JSend.success({ user }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

// Lấy tất cả người dùng
async function getAllUsers(req, res, next) {
  let result = {
    users: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  try {
    result = await UserService.getAllUsers(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
  return res.json(
    JSend.success({
      users: result.users,
      metadata: result.metadata,
    })
  );
}

// Xóa người dùng
async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;
    const deleted = await UserService.deleteUser(userId);
    if (!deleted) {
      return next(new ApiError(404, "User not found"));
    }
    return res
      .status(200)
      .json(JSend.success({ message: "User deleted successfully" }));
  } catch (error) {
    next(error);
  }
}

// Chỉnh sửa thông tin người dùng
async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await UserService.updateUser(userId, updateData);
    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }
    return res.status(200).json(
      JSend.success({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role_id: updatedUser.role_id,
          address: updatedUser.address,
          phone_number: updatedUser.phone_number,
        },
      })
    );
  } catch (error) {
    next(error);
  }
}

// Lấy thông tin người dùng đang đăng nhập
async function getMyInfo(req, res, next) {
  try {
    const userId = req.user.id; // req.user được gán từ middleware xác thực
    const user = await UserService.getUserById(userId);
    const role = await RoleService.getRoleById(user.role_id);

    if (!user) {
      return next(new ApiError(404, "User does not exist"));
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role ? role.name : "Unknown",
      address: user.address || null,
      phone_number: user.phone_number || null,
    };

    return res.json(JSend.success({ user: userResponse }));
  } catch (err) {
    next(err);
  }
}

async function updateMyInfo(req, res, next) {
  try {
    const userId = req.user.id; // req.user được gán từ middleware xác thực
    const updateData = req.body;

    const updatedUser = await UserService.updateUser(userId, updateData);
    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }

    return res.status(200).json(
      JSend.success({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role_id: updatedUser.role_id,
          address: updatedUser.address,
          phone_number: updatedUser.phone_number,
        },
      })
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
  getMyInfo,
  updateMyInfo,
};
