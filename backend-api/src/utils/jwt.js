const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_default_secret_key";

// Tạo access token
const signToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Xác thực access token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

// Tạo refresh token
const signRefreshToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Xác thực refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

// Làm mới access token từ refresh token
const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    // Loại bỏ các trường hệ thống của JWT
    const { iat, exp, ...payload } = decoded;
    return signToken(payload);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = {
  signToken,
  verifyToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshAccessToken,
};
