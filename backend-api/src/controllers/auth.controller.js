const authService = require("../services/auth.service");
const roleService = require("../services/role.service");
const ApiError = require("../utils/api-error");
const JSend = require("../utils/jsend");
const { hashPassword } = require("../utils/bcrypt");
const {
  signToken,
  signRefreshToken,
  refreshAccessToken,
} = require("../utils/jwt");

async function register(req, res, next) {
  try {
    const roleName = req.body.role;
    const roleId = await roleService.getRoleIdByName(roleName);
    if (!roleId) {
      return next(new ApiError(404, "Role not found"));
    }
    const userExists = await authService.findByEmail(req.body.email);
    if (userExists) return next(new ApiError(400, "Email already registered"));

    const authData = {
      name: req.body.name,
      email: req.body.email,
      role_id: roleId,
      password_hash: await hashPassword(req.body.password),
    };

    const user = await authService.register(authData);

    // Tạo access token và refresh token cho user mới đăng ký
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
    };
    const token = signToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json(
      JSend.success({
        token,
        refreshToken,
        user: {
          name: user.name,
          email: user.email,
          role: roleName,
        },
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const loginData = { ...req.body };
    const user = await authService.login(loginData);
    if (!user) {
      return next(new ApiError(400, "Invalid email or password"));
    }
    const role = await roleService.getRoleById(user.role_id);
    if (!role) {
      return next(new ApiError(404, "Role not found"));
    }
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role.name,
    };
    const token = signToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("Content-Type", "application/json");

    return res.json(
      JSend.success({
        token,
        refreshToken,
        user: {
          name: user.name,
          email: user.email,
          role: role.name,
        },
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.setHeader("Authorization", "");
    res.setHeader("Content-Type", "application/json");
    return res.json(JSend.success({ message: "Logged out successfully" }));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

// Làm mới access token từ refresh token
async function refresh(req, res, next) {
  try {
    const refreshToken =
      req.body.refreshToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!refreshToken) {
      return next(new ApiError(401, "No refresh token provided"));
    }

    try {
      // Xác thực refresh token và tạo access token mới
      const newToken = refreshAccessToken(refreshToken);
      return res.json(
        JSend.success({
          token: newToken,
        })
      );
    } catch (err) {
      return res
        .status(401)
        .json(JSend.fail("Invalid or expired refresh token"));
    }
  } catch (error) {
    next(error);
  }
}

async function requestReset(req, res, next) {
  try {
    const email = req.body.email;
    const user = await authService.findByEmail(email);
    if (!user) return next(new ApiError(404, "Email not registered"));

    await authService.requestPasswordReset(email);
    return res.json(
      JSend.success({ message: "Reset code sent to your email" })
    );
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { email, code, newPassword } = req.body;
    const hashed = await hashPassword(newPassword);
    const success = await authService.resetPassword(email, code, hashed);

    if (!success) return next(new ApiError(400, "Invalid or expired code"));

    return res.json(JSend.success({ message: "Password reset successful" }));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  requestReset,
  resetPassword,
};
