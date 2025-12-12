const knex = require("../database/knex");
const { comparePassword } = require("../utils/bcrypt");
const { sendMail, generateCode } = require("../utils/email");

function authRepository() {
  return knex("users");
}

function findByEmail(email) {
  return authRepository().where({ email }).first();
}

async function register(authData) {
  const [user] = await authRepository().insert(authData).returning("*");
  return { ...user, password: undefined };
}

async function login(loginData) {
  const user = await findByEmail(loginData.email);
  if (!user) {
    return null; // Trả về null nếu không tìm thấy người dùng
  }

  // So sánh mật khẩu đã băm
  const isPasswordValid = await comparePassword(
    loginData.password,
    user.password_hash
  );
  if (!isPasswordValid) {
    return null; // Trả về null nếu mật khẩu không hợp lệ
  }

  // Trả về user không có password
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role_id: user.role_id,
  };
}

async function requestPasswordReset(email) {
  const code = generateCode();
  await knex("password_resets").insert({ email, code });

  await sendMail({
    to: email,
    subject: "Khôi phục mật khẩu",
    text: `Mã xác nhận khôi phục mật khẩu của bạn là: ${code}\nMã này có hiệu lực trong 15 phút.`,
  });
  return true;
}

async function verifyResetCode(email, code) {
  const record = await knex("password_resets")
    .where({ email, code })
    .orderBy("created_at", "desc")
    .first();

  if (!record) return false;

  const createdTime = new Date(record.created_at).getTime();
  const now = Date.now();
  const diffMinutes = (now - createdTime) / 60000;

  return diffMinutes <= 15; // chỉ hợp lệ trong 15 phút
}

async function resetPassword(email, code, hashPassword) {
  const isValid = await verifyResetCode(email, code);
  if (!isValid) return false;

  await authRepository()
    .where({ email })
    .update({ password_hash: hashPassword });

  // Xóa mã đã dùng để tránh tái sử dụng
  await knex("password_resets").where({ email, code }).del();

  return true;
}
module.exports = {
  register,
  login,
  findByEmail,
  requestPasswordReset,
  resetPassword,
};
