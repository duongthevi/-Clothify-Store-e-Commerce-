const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Xác thực mã đã gửi qua email
async function verifyCode(email, code, type = "verify") {
  const key = `${type}:${email}`;
  const savedCode = await redis.get(key);
  if (savedCode && savedCode === code) {
    await redis.del(key); // Xoá mã sau khi dùng
    return true;
  }
  return false;
}

// Lưu mã xác thực vào Redis
async function saveCode(email, code, type = "verify", expiresIn = 300) {
  await redis.set(`${type}:${email}`, code, "EX", expiresIn);
}

module.exports = {
  redis,
  verifyCode,
  saveCode,
};
